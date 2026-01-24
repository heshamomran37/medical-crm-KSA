"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageCircle, Play, CheckCircle2, AlertTriangle,
    FileUp, FileSpreadsheet, Users, Plus, Trash2,
    UserPlus, X, Loader2, FileText, History, MessageSquare, ExternalLink, Search
} from "lucide-react";
import * as XLSX from 'xlsx';
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { PatientForm } from "@/components/patients/PatientForm";

interface WhatsAppConversation {
    id: string;
    phone: string;
    name: string;
    lastMessage: string | { conversation: string };
    timestamp: string | Date;
}

export default function WhatsAppPageClient() {
    const { t, isRTL } = useLanguage();
    const [isMounted, setIsMounted] = useState(false);
    const [activeTab, setActiveTab] = useState<'wasender' | 'history' | 'patients'>('wasender');

    // --- Core Connection State ---
    const [isConnected, setIsConnected] = useState(false);
    const [isInitLoading, setIsInitLoading] = useState(false);

    // --- History State ---
    const [history, setHistory] = useState<WhatsAppConversation[]>([]);
    const [historySearchTerm, setHistorySearchTerm] = useState("");
    const [historyLoading, setHistoryLoading] = useState(false);

    // --- WASender State (Link Machine) ---
    const [bulkMessage, setBulkMessage] = useState("");
    const [bulkContacts, setBulkContacts] = useState<{ name: string; phone: string; status: 'pending' | 'sent' | 'failed' }[]>([]);
    const [currentIdx, setCurrentIdx] = useState(-1);
    const [manualPhoneInput, setManualPhoneInput] = useState("");
    const [quickRegisterPhone, setQuickRegisterPhone] = useState<string | null>(null);
    const [waLogs, setWaLogs] = useState<string[]>([]);

    // --- Database Patients State ---
    const [databasePatients, setDatabasePatients] = useState<any[]>([]);
    const [databasePatientsLoading, setDatabasePatientsLoading] = useState(false);
    const [dbSearchTerm, setDbSearchTerm] = useState("");

    useEffect(() => {
        setIsMounted(true);
        checkStatus();
    }, []);

    const fetchHistory = async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch("/api/whatsapp?action=conversations&limit=50");
            const data = await res.json();
            setHistory(data.conversations || []);
        } catch (err) {
            console.error("History fetch failed", err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const fetchDatabasePatients = async () => {
        setDatabasePatientsLoading(true);
        try {
            const res = await fetch("/api/whatsapp?action=get_patients");
            const data = await res.json();
            if (data.success) {
                setDatabasePatients(data.patients);
            }
        } catch (err) {
            console.error("Failed to fetch database patients", err);
        } finally {
            setDatabasePatientsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'history') {
            fetchHistory();
        } else if (activeTab === 'patients') {
            fetchDatabasePatients();
        }
    }, [activeTab]);

    const checkStatus = async () => {
        try {
            const res = await fetch("/api/whatsapp?action=status");
            const data = await res.json();
            setIsConnected(data.isConnected);
        } catch (err) {
            console.error("Status check failed", err);
        }
    };

    const handleInit = async () => {
        setIsInitLoading(true);
        try {
            await fetch("/api/whatsapp?action=init");
            setTimeout(checkStatus, 3000);
        } catch (err) {
            console.error("Init trigger failed", err);
        } finally {
            setTimeout(() => setIsInitLoading(false), 2000);
        }
    };

    const handleForceReset = async () => {
        if (!confirm("This will log you out of all devices and clear session data. Continue?")) return;
        setIsInitLoading(true);
        try {
            await fetch("/api/whatsapp?action=reset", { method: "POST" });
            setIsConnected(false);
            setTimeout(handleInit, 2000);
        } catch (err) {
            console.error("Reset failed", err);
        } finally {
            setTimeout(() => setIsInitLoading(false), 2000);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws) as any[];

            const contacts = data.map(row => ({
                name: row.name || row.Name || row['الاسم'] || "Contact",
                phone: String(row.phone || row.Phone || row['الجوال'] || row['الهاتف'] || "").replace(/[^\d]/g, ""),
                status: 'pending' as const
            })).filter(c => c.phone.length >= 8);

            setBulkContacts(prev => {
                const updated = [...prev, ...contacts];
                if (currentIdx === -1 && updated.length > 0) setCurrentIdx(0);
                return updated;
            });
            setWaLogs(prev => [`${contacts.length} contacts imported.`, ...prev]);
        };
        reader.readAsBinaryString(file);
    };

    const handleManualAdd = () => {
        if (!manualPhoneInput.trim()) return;
        const numbers = manualPhoneInput.split(/[,\n]/).map(n => n.trim().replace(/[^\d]/g, "")).filter(n => n.length >= 8);
        const newContacts = numbers.map(n => ({ name: "Contact", phone: n, status: 'pending' as const }));
        setBulkContacts(prev => {
            const updated = [...prev, ...newContacts];
            if (currentIdx === -1 && updated.length > 0) setCurrentIdx(0);
            return updated;
        });
        setManualPhoneInput("");
        setWaLogs(prev => [`➕ Added ${numbers.length} numbers manually`, ...prev]);
    };

    const handleDeleteContact = (index: number) => {
        setBulkContacts(prev => {
            const updated = prev.filter((_, i) => i !== index);
            if (index < currentIdx) setCurrentIdx(prevIdx => prevIdx - 1);
            else if (index === currentIdx) {
                if (updated.length === 0) setCurrentIdx(-1);
                else if (index >= updated.length) setCurrentIdx(updated.length - 1);
            }
            return updated;
        });
    };

    const openWhatsAppLink = async (contact: any, index: number) => {
        const personalizedMsg = bulkMessage.replace(/{{name}}/g, contact.name);
        const encodedMsg = encodeURIComponent(personalizedMsg);

        let phone = contact.phone.replace(/[^\d]/g, "");
        if (phone.startsWith("0") && !phone.startsWith("00")) {
            phone = "2" + phone;
        }

        setWaLogs(prev => [`⏳ Syncing message log for ${contact.name}...`, ...prev]);
        try {
            await fetch("/api/whatsapp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "log_sent_message",
                    phoneNumber: phone,
                    message: personalizedMsg
                })
            });
            setWaLogs(prev => [`📝 Message recorded in history for ${contact.name}`, ...prev]);
        } catch (err) {
            console.error("Failed to sync message log:", err);
            setWaLogs(prev => [`❌ Sync failed for ${contact.name}`, ...prev]);
        }

        const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMsg}`;
        const link = document.createElement('a');
        link.href = url;
        link.target = 'WhatsAppGlobalSession';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setBulkContacts(prev => {
            const next = [...prev];
            next[index] = { ...next[index], status: 'sent' };
            return next;
        });
        setCurrentIdx(index + 1);
        setWaLogs(prev => [`✅ Link generated for ${contact.name}`, ...prev]);
    };

    if (!isMounted) return null;

    return (
        <div className={cn("flex flex-col h-[calc(100vh-100px)] gap-6 p-4 md:p-8 bg-slate-50/50", isRTL && "text-right")} suppressHydrationWarning>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                        <MessageCircle size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">WhatsApp Elite</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleInit}
                                    disabled={isInitLoading}
                                    className={cn(
                                        "text-[10px] font-black hover:text-green-600 transition-colors uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100",
                                        isInitLoading ? "text-slate-300 pointer-events-none" : "text-slate-500"
                                    )}
                                >
                                    {isInitLoading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                                    {isInitLoading ? "Initializing..." : "Refresh Connection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
                    <button
                        onClick={() => setActiveTab('wasender')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === 'wasender' ? "bg-white text-[#0a192f] shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <History size={16} />
                        WASender
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === 'history' ? "bg-white text-[#0a192f] shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <MessageSquare size={16} />
                        {t('history')}
                    </button>
                    <button
                        onClick={() => setActiveTab('patients')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            activeTab === 'patients' ? "bg-white text-[#0a192f] shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <Users size={16} />
                        {t('patients')}
                    </button>
                    <button
                        onClick={() => window.open('https://web.whatsapp.com', 'WhatsAppGlobalSession')}
                        className="flex items-center gap-2 px-6 ml-2 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        <ExternalLink size={20} />
                        {t('open_whatsapp_web')}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in duration-500">
                {activeTab === 'wasender' ? (
                    <div className="flex-1 flex overflow-hidden flex-col md:flex-row">
                        {/* Left Column: Message Editor & Actions */}
                        <div className="flex-1 border-r border-slate-100 flex flex-col min-h-0 overflow-y-auto custom-scrollbar">
                            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                                <FileText size={16} className="text-slate-400" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">{t('message_template')}</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                <textarea
                                    value={bulkMessage}
                                    onChange={(e) => setBulkMessage(e.target.value)}
                                    placeholder={t('variable_help')}
                                    className="w-full h-48 p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-sm font-bold resize-none outline-none focus:border-[#b78a5d]/30 transition-all font-sans"
                                />
                                <div className="flex flex-wrap gap-2">
                                    {['{{name}}', t('pricing_fees'), t('booking_inquiries')].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setBulkMessage(prev => prev + ' ' + tag)}
                                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-[#b78a5d] hover:text-[#b78a5d] transition-all"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 pt-0 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#b78a5d]/50 hover:bg-slate-50 cursor-pointer transition-all">
                                        <FileSpreadsheet size={24} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{t('import_excel')}</span>
                                        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
                                    </label>
                                    <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
                                        <Users size={24} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('select_patients')}</span>
                                    </button>
                                </div>

                                <div className="relative">
                                    <textarea
                                        value={manualPhoneInput}
                                        onChange={(e) => setManualPhoneInput(e.target.value)}
                                        placeholder={t('phone_manual_entry')}
                                        autoComplete="off"
                                        data-lpignore="true"
                                        className="w-full h-24 p-4 rounded-xl bg-slate-50 border-none text-sm font-bold outline-none focus:ring-2 focus:ring-[#b78a5d]/20 resize-none font-sans"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={handleManualAdd}
                                            className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all"
                                        >
                                            {t('add_to_list')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                const phone = manualPhoneInput.trim().replace(/[^\d]/g, "");
                                                if (phone.length >= 8) setQuickRegisterPhone(phone);
                                            }}
                                            className="px-4 bg-[#b78a5d]/10 text-[#b78a5d] rounded-xl hover:bg-[#b78a5d]/20 transition-all flex items-center"
                                        >
                                            <UserPlus size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-amber-50/50 border-t border-amber-100 flex gap-4">
                                <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                                <p className="text-[10px] text-amber-800 font-bold leading-relaxed">{t('bulk_sending_caution')}</p>
                            </div>
                        </div>

                        {/* Right Column: List & Logs */}
                        <div className="w-full md:w-96 bg-slate-50 flex flex-col min-h-0">
                            <div className="p-6 bg-white border-b border-slate-100 flex flex-col gap-3">
                                <div className="flex justify-between items-center px-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#0a192f]">{t('progress')}</h4>
                                    <span className="text-sm font-black text-green-500">{bulkContacts.filter(c => c.status === 'sent').length} / {bulkContacts.length}</span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-green-500 transition-all duration-700" style={{ width: `${(bulkContacts.filter(c => c.status === 'sent').length / (bulkContacts.length || 1)) * 100}%` }} />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {bulkContacts.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-center gap-4">
                                        <Users size={48} />
                                        <p className="text-xs font-black uppercase">{t('select_patients')}</p>
                                    </div>
                                ) : (
                                    bulkContacts.map((c, i) => (
                                        <div key={i} className={cn(
                                            "p-4 rounded-2xl border flex items-center justify-between transition-all bg-white",
                                            i === currentIdx ? "border-green-200 shadow-md scale-102" : "border-slate-100",
                                            c.status === 'sent' && "opacity-40"
                                        )}>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="text-xs font-black text-slate-700 truncate">{c.name}</h5>
                                                <p className="text-[9px] font-bold text-slate-400">{c.phone}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteContact(i)}
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                {c.status === 'pending' ? (
                                                    <button
                                                        onClick={() => openWhatsAppLink(c, i)}
                                                        className={cn("px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest transition-all", i === currentIdx ? "bg-[#25D366] shadow-lg" : "bg-slate-800")}
                                                    >
                                                        {t('send')}
                                                    </button>
                                                ) : (
                                                    <CheckCircle2 size={18} className="text-green-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="h-32 bg-slate-900 p-4 font-mono text-[8px] text-slate-500 overflow-y-auto space-y-1">
                                {waLogs.map((log, i) => <div key={i}>[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}] {log}</div>)}
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'history' ? (
                    // --- HISTORY TAB UI ---
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder={t('search_placeholder')}
                                    value={historySearchTerm}
                                    onChange={(e) => setHistorySearchTerm(e.target.value)}
                                    autoComplete="off"
                                    data-lpignore="true"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#b78a5d]/20 transition-all font-sans"
                                />
                            </div>
                            <button
                                onClick={fetchHistory}
                                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500"
                                title="Reload History"
                            >
                                {historyLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="rotate-90" />}
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-4">
                                {history
                                    .filter(item => {
                                        const name = (item?.name || "").toLowerCase();
                                        const phone = item?.phone || "";
                                        const search = (historySearchTerm || "").toLowerCase();
                                        return name.includes(search) || phone.includes(search);
                                    })
                                    .map((item) => (
                                        <div key={item.id || item.phone} className="p-6 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform shadow-sm">
                                                    <Users size={24} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-black text-slate-700 truncate">{item?.name || "Unknown"}</h4>
                                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[8px] font-black uppercase text-slate-400 tracking-tighter">{item?.phone || "N/A"}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-1 italic opacity-80 truncate">
                                                        {typeof item?.lastMessage === 'string'
                                                            ? item.lastMessage
                                                            : (item?.lastMessage as any)?.conversation || "No message content"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end shrink-0">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                    {new Date(item.timestamp).toLocaleDateString('en-GB')}
                                                </span>
                                                <span className="text-[8px] font-bold text-slate-400">
                                                    {new Date(item.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                {history.length === 0 && !historyLoading && (
                                    <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
                                        <History size={64} />
                                        <p className="font-black uppercase tracking-widest text-sm">No Sent History Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- PATIENTS TAB UI ---
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder={t('search_patients')}
                                    value={dbSearchTerm}
                                    onChange={(e) => setDbSearchTerm(e.target.value)}
                                    autoComplete="off"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-sm font-bold outline-none focus:ring-2 focus:ring-[#b78a5d]/20 transition-all font-sans"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const filtered = databasePatients.filter(p =>
                                            p.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
                                            (p.phone && p.phone.includes(dbSearchTerm))
                                        );
                                        const toAdd = filtered.map(p => ({
                                            name: p.name,
                                            phone: p.phone || p.whatsapp || "",
                                            status: 'pending' as const
                                        })).filter(c => c.phone.length >= 8);

                                        setBulkContacts(prev => [...prev, ...toAdd]);
                                        setActiveTab('wasender');
                                        setWaLogs(prev => [`➕ Added ${toAdd.length} patients to bulk list`, ...prev]);
                                    }}
                                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Add All Filtered
                                </button>
                                <button
                                    onClick={fetchDatabasePatients}
                                    className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-500"
                                >
                                    {databasePatientsLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="rotate-90" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {databasePatients
                                    .filter(p =>
                                        p.name.toLowerCase().includes(dbSearchTerm.toLowerCase()) ||
                                        (p.phone && p.phone.includes(dbSearchTerm))
                                    )
                                    .map((p) => (
                                        <div key={p.id} className="p-5 bg-white border border-slate-100 rounded-[2rem] hover:shadow-md transition-all group flex flex-col justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-[#b78a5d]/10 flex items-center justify-center text-[#b78a5d]">
                                                    <Users size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-black text-slate-700 truncate">{p.name}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400">{p.phone || p.whatsapp || "No Phone"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-50">
                                                <span className="px-3 py-1 rounded-full bg-slate-50 text-[8px] font-black uppercase text-slate-400 tracking-tighter">
                                                    {p.type || "Individual"}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        const phone = (p.phone || p.whatsapp || "").replace(/[^\d]/g, "");
                                                        if (phone.length < 8) return;
                                                        setBulkContacts(prev => [...prev, { name: p.name, phone, status: 'pending' }]);
                                                        setWaLogs(prev => [`➕ Added ${p.name} to bulk list`, ...prev]);
                                                    }}
                                                    className="p-2 bg-slate-50 text-slate-400 hover:bg-[#b78a5d]/10 hover:text-[#b78a5d] rounded-xl transition-all"
                                                    title="Add to WASender"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                {databasePatients.length === 0 && !databasePatientsLoading && (
                                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-20 text-center gap-4">
                                        <Users size={64} />
                                        <p className="font-black uppercase tracking-widest text-sm">No Patients Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Global Registration Popup */}
            {quickRegisterPhone && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300 p-4">
                    <div className="w-full max-w-4xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto rounded-[3rem]">
                        <button onClick={() => setQuickRegisterPhone(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all">
                            <X size={24} />
                        </button>
                        <PatientForm
                            initialPhone={quickRegisterPhone}
                            onSuccess={() => {
                                setWaLogs(prev => [`✅ Patient registered: ${quickRegisterPhone}`, ...prev]);
                                setTimeout(() => setQuickRegisterPhone(null), 1000);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
