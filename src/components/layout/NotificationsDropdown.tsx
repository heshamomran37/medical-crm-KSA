"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Activity, PlusCircle, UserPlus, DollarSign, Wallet, CreditCard, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { getRecentActivityLogs } from "@/lib/actions";

interface Log {
    id: string;
    action: string;
    description: string;
    userId: string | null;
    createdAt: Date;
}

export function NotificationsDropdown() {
    const { t, isRTL } = useLanguage();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const data = await getRecentActivityLogs();
                setLogs(data as any);
                const lastRead = Number(localStorage.getItem('lastNotificationReadTime') || 0);
                setUnreadCount(data.filter(l => new Date(l.createdAt).getTime() > lastRead).length);
            } catch (e) {
                console.error(e);
            }
        };
        fetchLogs();
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOpen = () => {
        if (!isOpen) {
            // Mark as read when opening
            localStorage.setItem('lastNotificationReadTime', Date.now().toString());
            setUnreadCount(0);
        }
        setIsOpen(!isOpen);
    };

    const getIconForAction = (action: string) => {
        if (action.includes("SALE")) return <DollarSign size={14} className="text-emerald-500" />;
        if (action.includes("EXPENSE")) return <Wallet size={14} className="text-red-500" />;
        if (action.includes("PATIENT")) return <UserPlus size={14} className="text-blue-500" />;
        if (action.includes("EMPLOYEE")) return <UserPlus size={14} className="text-purple-500" />;
        if (action.includes("RESET") || action.includes("DELETE")) return <Trash2 size={14} className="text-orange-500" />;
        return <Activity size={14} className="text-[#b78a5d]" />;
    };

    const getBgForAction = (action: string) => {
        if (action.includes("SALE")) return "bg-emerald-500/10 border-emerald-500/20";
        if (action.includes("EXPENSE")) return "bg-red-500/10 border-red-500/20";
        if (action.includes("PATIENT")) return "bg-blue-500/10 border-blue-500/20";
        if (action.includes("EMPLOYEE")) return "bg-purple-500/10 border-purple-500/20";
        if (action.includes("RESET") || action.includes("DELETE")) return "bg-orange-500/10 border-orange-500/20";
        return "bg-amber-500/10 border-amber-500/20";
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleOpen}
                className={cn(
                    "p-2 relative rounded-full transition-colors",
                    isOpen ? "bg-white/10 text-white" : "hover:bg-white/5 text-slate-400 hover:text-white"
                )}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={cn(
                        "absolute top-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a192f]",
                        isRTL ? "left-2" : "right-2"
                    )}></span>
                )}
            </button>

            {isOpen && (
                <div
                    className={cn(
                        "absolute top-full mt-2 w-80 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in",
                        isRTL ? "left-0" : "right-0"
                    )}
                    dir={isRTL ? "rtl" : "ltr"}
                >
                    <div className="p-4 border-b border-white/10 bg-[#0a192f]/50 flex justify-between items-center text-sm font-bold uppercase tracking-wider text-white">
                        <span className="flex items-center gap-2">
                            <Bell size={16} className="text-[#b78a5d]" />
                            {isRTL ? "الإشعارات" : "Notifications"}
                        </span>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 text-sm">
                                {isRTL ? "لا توجد إشعارات حديثة" : "No recent notifications"}
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {logs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-4 hover:bg-white/5 transition-colors text-right flex gap-3"
                                        dir={isRTL ? "rtl" : "ltr"}
                                    >
                                        <div className={cn("mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center border", getBgForAction(log.action))}>
                                            {getIconForAction(log.action)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm text-white font-medium line-clamp-2">
                                                {log.description}
                                            </p>
                                            <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                <span className="text-[#b78a5d]">{log.userId}</span>
                                                <span>•</span>
                                                <span>
                                                    {new Date(log.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span>
                                                    {new Date(log.createdAt).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen(false);
                            router.push('/activity');
                        }}
                        className="w-full p-3 bg-white/5 hover:bg-white/10 text-xs font-bold text-center text-white transition-colors"
                    >
                        {isRTL ? "عرض كل السجلات" : "View All Activity Logs"}
                    </button>
                </div>
            )}
        </div>
    );
}
