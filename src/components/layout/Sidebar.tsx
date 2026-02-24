"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    MessageCircle,
    Settings,
    Activity,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User as UserIcon,
    Stethoscope,
    DatabaseBackup
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const allMenuItems = [
    { icon: LayoutDashboard, label: "dashboard", href: "/dashboard", adminOnly: false },
    { icon: Stethoscope, label: "employees", href: "/employees", adminOnly: true },
    { icon: Users, label: "patients", href: "/patients", adminOnly: false },
    { icon: LayoutDashboard, label: "sales", href: "/sales", adminOnly: false },
    { icon: DatabaseBackup, label: "backup_restore", href: "/backup", adminOnly: true },
    { icon: MessageCircle, label: "whatsapp", href: "/whatsapp", adminOnly: false },
    { icon: Activity, label: "activity", href: "/activity", adminOnly: false },
    { icon: Settings, label: "settings", href: "/settings", adminOnly: false },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const { t, isRTL } = useLanguage();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isLoading = status === "loading";
    const userName = session?.user?.name || "";
    const userRole = session?.user?.role || "";
    const userType = session?.user?.userType || "";

    const isAdmin =
        !isLoading && (
            userType === "ADMIN" ||
            userRole?.toUpperCase() === "ADMIN" ||
            userName?.toLowerCase() === "admin"
        );

    const menuItems = allMenuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <aside
            className={cn(
                "h-screen bg-[#0a192f] text-white transition-all duration-300 ease-in-out relative z-20 flex flex-col shadow-2xl shadow-[#0a192f]/50",
                isCollapsed ? "w-20" : "w-72",
                isRTL ? "border-l border-[#ffffff]/5" : "border-r border-[#ffffff]/5"
            )}
        >
            {/* Logo Section */}
            <div className={cn("p-6 mb-4 flex items-center justify-between overflow-hidden", isRTL && "flex-row-reverse")}>
                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/5 shrink-0 overflow-hidden border border-white/10">
                        <img src="/company-logo.jpg" alt="Rawad" className="w-full h-full object-cover" />
                    </div>
                    {!isCollapsed && (
                        <div className={cn("flex flex-col animate-in fade-in slide-in-from-left-2 duration-300", isRTL && "text-right")}>
                            <span className="font-serif italic text-2xl font-bold tracking-tight text-white leading-none">MedCRM</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-[#b78a5d] mt-1">Rawad Al-Mati Tech</span>
                        </div>
                    )}
                </div>
                {!isCollapsed && (
                    <button
                        onClick={() => setIsCollapsed(true)}
                        className="text-slate-500 hover:text-white transition-colors"
                    >
                        {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                                isActive
                                    ? "bg-[#b78a5d] text-white shadow-lg shadow-[#b78a5d]/30"
                                    : "text-slate-400 hover:text-white hover:bg-white/5",
                                isRTL && "flex-row-reverse"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-white")} />
                            {!isCollapsed && (
                                <span className={cn("text-[11px] font-black uppercase tracking-widest", isRTL && "text-right flex-1")}>{t(item.label)}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <div className={cn("absolute w-1 h-6 bg-white rounded-full", isRTL ? "right-2" : "left-2")} />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Section: User & Logout */}
            <div className="p-4 border-t border-white/5 bg-[#081526]/50 space-y-4">
                {/* User Info */}
                <div className={cn(
                    "bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center gap-3 transition-all",
                    isCollapsed ? "justify-center" : "",
                    !isCollapsed && isRTL && "flex-row-reverse"
                )}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#b78a5d] to-[#8c6a47] flex items-center justify-center shrink-0">
                        <UserIcon className="text-white" size={16} />
                    </div>
                    {!isCollapsed && (
                        <div className={cn("min-w-0", isRTL && "text-right flex-1")}>
                            {isLoading ? (
                                <>
                                    <div className="h-3 w-20 bg-white/20 rounded animate-pulse mb-1" />
                                    <div className="h-2 w-16 bg-white/10 rounded animate-pulse" />
                                </>
                            ) : (
                                <>
                                    <p className="text-xs font-bold truncate text-slate-200">{userName}</p>
                                    <p className="text-[9px] font-black uppercase text-[#b78a5d] tracking-widest truncate">
                                        {userName?.toLowerCase() === 'admin' ? t('admin') : (t(userRole?.toLowerCase()) || t('staff'))}
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Logout */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className={cn(
                        "flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-[#ff4d4d] hover:bg-red-500/10 transition-all group",
                        isRTL && "flex-row-reverse"
                    )}
                >
                    <LogOut className={cn("w-5 h-5 transition-transform", isRTL ? "group-hover:translate-x-1" : "group-hover:-translate-x-1")} />
                    {!isCollapsed && (
                        <span className={cn("text-[11px] font-black uppercase tracking-widest", isRTL && "text-right flex-1")}>{t('logout')}</span>
                    )}
                </button>

                {!isCollapsed && (
                    <div className="pt-2 text-center border-t border-white/5">
                        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-50">
                            Developed by Rawad Al-Mati
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}
