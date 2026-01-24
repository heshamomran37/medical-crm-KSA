import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppService } from "@/lib/whatsapp-service";
import { prisma } from "@/lib/prisma";

// HMR-safe Initialization promise for Next.js
declare global {
    var whatsappInitPromise: Promise<void> | null | undefined;
}

async function ensureInitialized(force: boolean = false) {
    if (!global.whatsappInitPromise || force) {
        console.log(`[API] 🚀 ensureInitialized: ${force ? "FORCING NEW PROMISE" : "Starting new promise"}`);
        const service = getWhatsAppService();
        global.whatsappInitPromise = service.initialize(force).catch(err => {
            console.error("[API] ❌ Async Init Loop Failed:", err);
            global.whatsappInitPromise = null;
            throw err;
        });
    }
    await global.whatsappInitPromise;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    try {
        const service = getWhatsAppService();

        switch (action) {
            case "status":
                // Eagerly start initialization removed for debug
                return NextResponse.json({
                    isConnected: service.getConnectionStatus(),
                    qrCode: service.getQRCodeValue(),
                    pairingCode: service.getPairingCode(),
                    initError: service.getInitError(),
                    isInitializing: service.getIsInitializing(),
                    isStartingBrowser: service.getIsStartingBrowser(),
                });

            case "request-pairing-code":
                const pairingPhone = searchParams.get("phone");
                if (!pairingPhone) {
                    return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
                }
                try {
                    const pairingCode = await service.requestPairingCode(pairingPhone);
                    return NextResponse.json({ success: true, pairingCode });
                } catch (error) {
                    return NextResponse.json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to generate pairing code"
                    }, { status: 500 });
                }

            case "qr":
                await ensureInitialized();
                return NextResponse.json({ qrCode: service.getQRCodeValue() });

            case "conversations":
                const limit = parseInt(searchParams.get("limit") || "10");
                const conversations = await service.getRecentConversations(limit);
                return NextResponse.json({ conversations });

            case "messages":
                const patientId = searchParams.get("patientId");
                if (!patientId) {
                    return NextResponse.json(
                        { error: "Patient ID is required" },
                        { status: 400 }
                    );
                }
                const messages = await service.getMessages(patientId);
                return NextResponse.json({ messages });

            case "init":
                try {
                    console.log("📞 API: Received init request (FORCED RESTART)");
                    // Always wipe the current promise for init requests
                    global.whatsappInitPromise = null;
                    await service.shutdown();

                    console.log("⏳ API: Starting forced initialization...");
                    await ensureInitialized(true);

                    console.log("✅ API: Initialization successful");
                    return NextResponse.json({
                        success: true,
                        message: "WhatsApp service initialized successfully"
                    });
                } catch (error) {
                    console.error("❌ API: Init failed:", error);
                    return NextResponse.json({
                        success: false,
                        error: error instanceof Error ? error.message : "Failed to initialize WhatsApp",
                        message: "WhatsApp initialization failed. Check logs for details."
                    }, { status: 500 });
                }

            case "get_patients":
                try {
                    const patientsList = await (prisma as any).patient.findMany({
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            whatsapp: true,
                            type: true
                        },
                        orderBy: { name: 'asc' }
                    });
                    return NextResponse.json({ success: true, patients: patientsList });
                } catch (err) {
                    console.error("Failed to fetch patients:", err);
                    return NextResponse.json({ success: false, error: "Failed to fetch patients" }, { status: 500 });
                }

            case "debug":
                console.log("🛠️ API: Debug request received");
                return NextResponse.json({
                    source: "NEW_DEBUG_VERSION_v2",
                    instanceId: (service as any).instanceId,
                    serviceStatus: service.getStatus(),
                    hasSock: !!(service as any).sock,
                    isInitializing: service.getIsInitializing(),
                    initPromise: !!(service as any).initPromise
                });

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("WhatsApp API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, phoneNumber, message } = body;

        const service = getWhatsAppService();

        switch (action) {
            case "send":
                if (!phoneNumber || !message) {
                    return NextResponse.json(
                        { error: "Phone number and message are required" },
                        { status: 400 }
                    );
                }
                await service.sendMessage(phoneNumber, message);
                return NextResponse.json({
                    success: true,
                    message: "Message sent successfully"
                });

            case "disconnect":
                await service.disconnect();
                return NextResponse.json({
                    success: true,
                    message: "WhatsApp disconnected"
                });

            case "delete_conversation":
                if (!body.patientId) {
                    return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
                }
                await service.deleteConversation(body.patientId);
                return NextResponse.json({ success: true, message: "Conversation deleted" });

            case "mark_read":
                if (!body.patientId) {
                    return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
                }
                await service.markAsRead(body.patientId);
                return NextResponse.json({ success: true, message: "Messages marked as read" });

            case "reset":
                await service.wipe();
                return NextResponse.json({ success: true, message: "WhatsApp session reset" });

            case "log_sent_message":
                if (!body.phoneNumber || !body.message) {
                    return NextResponse.json({ error: "Phone and message required" }, { status: 400 });
                }
                await (service as any).logManualOutgoingMessage(body.phoneNumber, body.message);
                return NextResponse.json({ success: true });

            default:
                return NextResponse.json(
                    { error: "Invalid action" },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error("WhatsApp API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
