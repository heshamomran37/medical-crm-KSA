import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    proto,
    WASocket,
    Contact,
    Browsers
} from "@whiskeysockets/baileys";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import path from "path";
import fs from "fs";
import pino from "pino";

/**
 * Production-ready WhatsApp Service using @whiskeysockets/baileys
 * Features:
 * - WebSocket based (lightweight, no Puppeteer)
 * - Multi-file auth state
 * - QR code generation
 * - Message persistence
 * - Auto-reconnection
 */
class WhatsAppService {
    private socket: WASocket | null = null;
    private qrCode: string | null = null;
    private isConnected = false;
    private isInitializing = false;
    private initError: string | null = null;
    private pairingCode: string | null = null;
    public instanceId: string;
    private authFolder: string;

    constructor() {
        this.instanceId = Math.random().toString(36).substring(7);
        this.authFolder = path.join(process.cwd(), "baileys_auth_info");
        console.log(`[WhatsAppService] Instance ${this.instanceId} created`);

        // Ensure auth folder exists
        if (!fs.existsSync(this.authFolder)) {
            fs.mkdirSync(this.authFolder, { recursive: true });
        }
    }

    /**
     * Initialize WhatsApp socket
     */
    async initialize(force: boolean = false): Promise<void> {
        if (!force && (this.isInitializing || (this.socket && this.isConnected))) {
            console.log(`[WhatsAppService] Already initializing or connected`);
            return;
        }

        if (force) {
            console.log(`[WhatsAppService] 💥 FORCING INITIALIZATION RESTART...`);
        }

        this.isInitializing = true;
        this.initError = null;

        try {
            console.log(`[WhatsAppService] 🔑 Loading Auth State from: ${this.authFolder}`);
            const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);
            console.log(`[WhatsAppService] 📁 Auth State loaded. Has creds: ${!!state.creds}`);

            console.log(`[WhatsAppService] 🌐 Fetching latest WA version...`);
            const { version, isLatest } = await fetchLatestBaileysVersion();
            console.log(`[WhatsAppService] 📦 WA Version: v${version.join('.')}, isLatest: ${isLatest}`);

            console.log(`[WhatsAppService] 🔌 Creating Socket...`);
            this.socket = makeWASocket({
                version,
                logger: pino({ level: 'info' }) as any,
                printQRInTerminal: true,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "info" }) as any),
                },
                browser: Browsers.macOS('Desktop'),
                generateHighQualityLinkPreview: true,
            });
            console.log(`[WhatsAppService] 🚀 Socket created. Instance: ${this.instanceId}`);

            // Credential updating
            this.socket.ev.on('creds.update', saveCreds);

            // Connection handling
            this.socket.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    console.log('[WhatsAppService] 📲 QR Code received from WA');
                    this.qrCode = await QRCode.toDataURL(qr);
                    await this.updateSessionInDB({
                        qrCode: this.qrCode,
                        isConnected: false
                    });
                }

                if (connection) {
                    console.log(`[WhatsAppService] 🔃 Connection status: ${connection}`);
                }

                if (connection === 'close') {
                    const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                    console.log(`[WhatsAppService] ❌ Connection closed. Code: ${statusCode}, Reason: ${lastDisconnect?.error}, Reconnecting: ${shouldReconnect}`);

                    this.isConnected = false;
                    this.qrCode = null;
                    await this.updateSessionInDB({ isConnected: false, qrCode: null });

                    if (shouldReconnect) {
                        this.initialize();
                    } else {
                        console.log('[WhatsAppService] Logged out. Delete auth folder to re-scan.');
                        this.initError = "Logged out";
                        this.isInitializing = false;
                    }
                } else if (connection === 'open') {
                    console.log('[WhatsAppService] ✅ Opened connection');
                    this.isConnected = true;
                    this.isInitializing = false;
                    this.qrCode = null;
                    this.initError = null;

                    const user = this.socket?.user;
                    await this.updateSessionInDB({
                        isConnected: true,
                        qrCode: null,
                        lastConnected: new Date(),
                        phoneNumber: user?.id?.split(':')[0] || null
                    });
                }
            });

            // Message handling
            this.socket.ev.on('messages.upsert', async (m) => {
                if (m.type === 'notify') {
                    for (const msg of m.messages) {
                        if (!msg.key?.fromMe) {
                            await this.handleIncomingMessage(msg);
                        } else {
                            // Optionally handle own messages if they come through upsert (usually they do)
                            await this.handleOutgoingMessage(msg);
                        }
                    }
                }
            });

        } catch (error: any) {
            console.error(`[WhatsAppService] Initialization failed:`, error);
            this.isInitializing = false;
            this.initError = error.message;
            throw error;
        }
    }

    private async findPatientByPhone(phone: string) {
        return await prisma.patient.findFirst({
            where: {
                OR: [
                    { phone: { contains: phone } },
                    { whatsapp: { contains: phone } },
                    { phone: { equals: phone.startsWith('2') ? phone.substring(1) : (phone.startsWith('0') ? '2' + phone : phone) } }
                ]
            }
        });
    }

    /**
     * Handle incoming Baileys messages
     */
    private async handleIncomingMessage(msg: proto.IWebMessageInfo): Promise<void> {
        try {
            if (!msg.key?.remoteJid) return;

            const remoteJid = msg.key.remoteJid;
            const phoneNumber = remoteJid.split('@')[0];
            const pushName = msg.pushName || phoneNumber;

            // Extract text
            const text = msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                msg.message?.imageMessage?.caption ||
                "";

            if (!text && !msg.message?.imageMessage) return; // Skip if no content we can handle

            console.log(`[WhatsAppService] 📨 Message from ${pushName}: ${text.substring(0, 50)}...`);

            // Find or create patient
            let patient = await this.findPatientByPhone(phoneNumber);

            if (!patient) {
                console.log(`[WhatsAppService] Creating new patient for ${phoneNumber}`);
                patient = await prisma.patient.create({
                    data: {
                        name: pushName,
                        phone: phoneNumber,
                        whatsapp: phoneNumber,
                        type: "Individual",
                        status: "Inquiry"
                    }
                });
            }

            // Save message
            await prisma.whatsAppMessage.create({
                data: {
                    patientId: patient.id,
                    senderPhone: phoneNumber,
                    senderName: pushName,
                    messageText: text,
                    messageType: msg.message?.imageMessage ? "media" : "chat",
                    direction: "incoming",
                    status: "received",
                    timestamp: new Date((msg.messageTimestamp as number) * 1000)
                }
            });

            console.log(`[WhatsAppService] ✅ Message saved to database`);

        } catch (error) {
            console.error(`[WhatsAppService] Error handling incoming message:`, error);
        }
    }

    /**
     * Explicitly log a manually sent message (e.g. from WASender)
     */
    async logManualOutgoingMessage(phone: string, text: string): Promise<void> {
        try {
            const cleanPhone = phone.replace(/[^\d]/g, "");
            console.log(`[WhatsAppService] 📝 Manual log request for: ${cleanPhone}`);

            let patient = await this.findPatientByPhone(cleanPhone);

            if (!patient) {
                console.log(`[WhatsAppService] 👤 Creating contact for manual log: ${cleanPhone}`);
                patient = await prisma.patient.create({
                    data: {
                        name: `Contact ${cleanPhone}`,
                        phone: cleanPhone,
                        whatsapp: cleanPhone,
                        type: "Individual",
                        status: "Inquiry"
                    }
                });
            }

            const savedMsg = await prisma.whatsAppMessage.create({
                data: {
                    patientId: patient.id,
                    senderPhone: cleanPhone,
                    senderName: "Me",
                    messageText: text,
                    messageType: "chat",
                    direction: "outgoing",
                    status: "sent",
                    timestamp: new Date()
                }
            });

            console.log(`[WhatsAppService] ✅ Manual message logged in DB ID: ${savedMsg.id}`);
        } catch (error) {
            console.error(`[WhatsAppService] ❌ Error in logManualOutgoingMessage:`, error);
            throw error;
        }
    }

    /**
     * Handle outgoing Baileys messages (captured from event)
     */
    async handleOutgoingMessage(msg: proto.IWebMessageInfo): Promise<void> {
        try {
            if (!msg.key?.remoteJid) return;
            const remoteJid = msg.key.remoteJid;
            const phoneNumber = remoteJid.split('@')[0];

            const text = msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                "";

            if (!text && !msg.message?.imageMessage) return;

            // Find or create patient (thread record)
            let patient = await this.findPatientByPhone(phoneNumber);

            if (!patient) {
                console.log(`[WhatsAppService] 👤 Creating contact for outgoing to ${phoneNumber}`);
                patient = await prisma.patient.create({
                    data: {
                        name: `Contact ${phoneNumber}`,
                        phone: phoneNumber,
                        whatsapp: phoneNumber,
                        type: "Individual",
                        status: "Inquiry"
                    }
                });
            }

            // Save message
            await prisma.whatsAppMessage.create({
                data: {
                    patientId: patient.id,
                    senderPhone: phoneNumber,
                    senderName: "Me",
                    messageText: text,
                    messageType: msg.message?.imageMessage ? "media" : "chat",
                    direction: "outgoing",
                    status: "sent",
                    timestamp: new Date((msg.messageTimestamp as number) * 1000)
                }
            });

        } catch (error) {
            console.error(`[WhatsAppService] Error handling outgoing message:`, error);
        }
    }

    /**
     * Send a message
     */
    async sendMessage(phoneNumber: string, message: string): Promise<{ success: boolean; messageId?: string }> {
        if (!this.socket || !this.isConnected) {
            throw new Error("WhatsApp is not connected");
        }

        try {
            const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
            const jid = `${cleanPhone}@s.whatsapp.net`;

            console.log(`[WhatsAppService] Sending message to ${jid}`);

            const sent = await this.socket.sendMessage(jid, { text: message });

            return {
                success: true,
                messageId: sent?.key.id || undefined
            };

        } catch (error: any) {
            console.error(`[WhatsAppService] Error sending message:`, error);
            throw new Error(`Failed to send message: ${error.message}`);
        }
    }

    /**
     * Get recent conversations
     * Reusing existing logic but fetching from DB
     */
    async getRecentConversations(limit: number = 20): Promise<any[]> {
        const messages = await prisma.whatsAppMessage.findMany({
            include: { patient: true },
            orderBy: { timestamp: "desc" },
            take: limit * 20
        });

        const grouped = new Map();
        for (const msg of messages) {
            const key = msg.patientId || msg.senderPhone;
            if (!key || grouped.has(key)) continue;

            let displayName = msg.patient?.name;
            if (!displayName) {
                displayName = (msg.senderName && msg.senderName !== "Me")
                    ? msg.senderName
                    : `Contact ${msg.senderPhone}`;
            }

            grouped.set(key, {
                id: msg.patientId || `temp_${msg.senderPhone}`,
                name: displayName,
                phone: msg.patient?.phone || msg.senderPhone,
                lastMessage: msg.messageText,
                timestamp: msg.timestamp,
                patient: msg.patient,
                unreadCount: 0
            });

            if (grouped.size >= limit) break;
        }

        return Array.from(grouped.values()).sort((a: any, b: any) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    async getMessages(patientId: string): Promise<any[]> {
        if (patientId.startsWith("temp_")) {
            const phone = patientId.replace("temp_", "");
            return await prisma.whatsAppMessage.findMany({
                where: { senderPhone: phone },
                orderBy: { timestamp: "asc" }
            });
        }

        return await prisma.whatsAppMessage.findMany({
            where: { patientId },
            orderBy: { timestamp: "asc" }
        });
    }

    private async updateSessionInDB(data: any): Promise<void> {
        try {
            const session = await prisma.whatsAppSession.findFirst();
            if (session) {
                await prisma.whatsAppSession.update({
                    where: { id: session.id },
                    data
                });
            } else {
                await prisma.whatsAppSession.create({ data });
            }
        } catch (error) {
            console.error(`[WhatsAppService] DB update error:`, error);
        }
    }

    async disconnect(): Promise<void> {
        console.log(`[WhatsAppService] 🔌 Disconnecting... (isInitializing=${this.isInitializing})`);
        this.isInitializing = false;
        if (this.socket) {
            try {
                this.socket.end(undefined);
            } catch (err) {
                console.error("[WhatsAppService] Error ending socket:", err);
            }
            this.socket = null;
            this.isConnected = false;
            this.qrCode = null;
        }
    }

    getStatus() {
        return {
            isConnected: this.isConnected,
            isInitializing: this.isInitializing,
            qrCode: this.qrCode,
            pairingCode: this.pairingCode,
            initError: this.initError
        };
    }

    // API Compatibility
    getQRCodeValue() { return this.qrCode; }
    getConnectionStatus() { return this.isConnected; }
    getIsInitializing() { return this.isInitializing; }
    getInitError() { return this.initError; }
    getIsStartingBrowser() { return this.isInitializing; } // Kept for compatibility
    getPairingCode() { return this.pairingCode; }
    async shutdown() { await this.disconnect(); }

    /**
     * Request a Pairing Code for a mobile number
     */
    async requestPairingCode(phoneNumber: string): Promise<string> {
        try {
            console.log(`[WhatsAppService] 📲 Pairing Code requested for: ${phoneNumber}`);

            // 1. Wipe and re-init to ensure a clean handshake for pairing
            await this.wipe();

            // 2. Start initialization but bypass normal loop to setup pairing
            this.isInitializing = true;
            this.pairingCode = null;

            console.log(`[WhatsAppService] 📁 Loading Auth State for Pairing...`);
            const { state, saveCreds } = await useMultiFileAuthState(this.authFolder);
            console.log(`[WhatsAppService] 🌐 Fetching WA version...`);
            const { version } = await fetchLatestBaileysVersion();

            console.log(`[WhatsAppService] 🔌 Creating Socket for Pairing...`);
            this.socket = makeWASocket({
                version,
                logger: pino({ level: 'info' }) as any,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "info" }) as any),
                },
                browser: ["Chrome (Linux)", "Chrome", "1.0.0"], // Browser must be set for pairing code
                printQRInTerminal: false,
            });

            this.socket.ev.on('creds.update', saveCreds);

            // The actual request - must happen BEFORE the socket connects fully or in parallel
            console.log(`[WhatsAppService] 📤 Requesting code from Baileys...`);
            const cleanPhone = phoneNumber.replace(/[^\d]/g, "");
            const code = await this.socket.requestPairingCode(cleanPhone);

            this.pairingCode = code;
            console.log(`[WhatsAppService] ✅ Pairing Code generated successfully: ${code}`);

            return code;
        } catch (error: any) {
            console.error(`[WhatsAppService] ❌ requestPairingCode FAILED:`, error);
            this.isInitializing = false;
            throw error;
        }
    }
    async markAsRead(patientId: string) {
        // Implementation depends on if we want to send a read receipt to WA
    }
    async deleteConversation(patientId: string) {
        await prisma.whatsAppMessage.deleteMany({ where: { patientId } });
    }

    /**
     * Complete wipe of session data
     */
    async wipe(): Promise<void> {
        console.log(`[WhatsAppService] 🧨 WIPING SESSION DATA...`);
        await this.shutdown();

        if (fs.existsSync(this.authFolder)) {
            try {
                fs.rmSync(this.authFolder, { recursive: true, force: true });
                console.log(`[WhatsAppService] ✅ Auth folder deleted`);
            } catch (err) {
                console.error(`[WhatsAppService] ❌ Failed to delete auth folder:`, err);
            }
        }

        // Re-create folder
        fs.mkdirSync(this.authFolder, { recursive: true });

        // Clear global promise to allow fresh init
        if (typeof global !== 'undefined') {
            (global as any).whatsappInitPromise = null;
        }
    }
}

// Singleton
declare global {
    var whatsappService: WhatsAppService | undefined;
}

export function getWhatsAppService(): WhatsAppService {
    if (!global.whatsappService || !(global.whatsappService as any).wipe) {
        if (global.whatsappService) {
            console.log("[WhatsAppService] 🔄 Detected stale instance (missing methods). Re-creating...");
        }
        global.whatsappService = new WhatsAppService();
    }
    return global.whatsappService;
}
