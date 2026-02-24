"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Filter, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { AddEmployeeDialog } from "@/components/employees/AddEmployeeDialog";
import EmployeeActions from "@/components/employees/EmployeeActions";
import { BackupRestoreButton } from "@/components/employees/BackupRestoreButton";
import { Employee } from "@prisma/client";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface EmployeesPageClientProps {
    employees: Employee[];
    totalPages: number;
    currentPage: number;
    query: string;
}

export function EmployeesPageClient({ employees, totalPages, currentPage, query }: EmployeesPageClientProps) {
    const { t, isRTL } = useLanguage();

    const getPageLink = (page: number) => {
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        params.set('page', page.toString());
        return `/employees?${params.toString()}`;
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6" dir={isRTL ? "rtl" : "ltr"}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className={cn(isRTL && "text-right")}>
                        <h1 className="text-4xl font-serif italic text-white flex items-center gap-3">
                            {t('employees_title')}
                        </h1>
                        <p className="text-slate-400 mt-2 font-medium">{t('employees_subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BackupRestoreButton />
                        <AddEmployeeDialog />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4 p-6 rounded-[2rem] bg-[#0a192f] border border-white/10 shadow-xl">
                    <form className="contents">
                        <div className="relative flex-1 min-w-[250px]">
                            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-500", isRTL ? "right-4" : "left-4")} size={18} />
                            <input
                                name="q"
                                defaultValue={query}
                                type="text"
                                placeholder={t('search_employees')}
                                className={cn(
                                    "w-full h-12 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600",
                                    isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                                )}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-6 h-12 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold hover:bg-[#b78a5d] hover:border-[#b78a5d] transition-all">
                            <Filter size={18} />
                            {t('apply')}
                        </button>
                    </form>
                </div>

                {/* Employee Grid - Business Card Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {employees.length === 0 ? (
                        <div className="md:col-span-3 text-center py-12 bg-card rounded-xl border border-border border-dashed">
                            <p className="text-muted-foreground">{t('no_employees_found')}</p>
                        </div>
                    ) : (
                        employees.map((emp) => (
                            <div key={emp.id} className="relative group flex flex-col p-6 rounded-[2rem] bg-[#0a192f] border border-white/10 hover:border-[#b78a5d]/30 shadow-xl transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                                <div className="flex items-start justify-between mb-6 relative">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#b78a5d]/10 text-[#b78a5d] flex items-center justify-center text-xl font-black font-serif italic border border-[#b78a5d]/20">
                                            {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className={cn(isRTL && "text-right")}>
                                            <h3 className="text-lg font-serif italic text-white truncate max-w-[180px] drop-shadow-sm">{emp.name}</h3>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] mt-1">{emp.role}</p>
                                        </div>
                                    </div>
                                    <EmployeeActions employee={emp} />
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-2 text-sm flex-1">
                                    {emp.email && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail size={14} className="shrink-0" />
                                            <span className="truncate" dir="ltr">{emp.email}</span>
                                        </div>
                                    )}
                                    {emp.phone && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone size={14} className="shrink-0" />
                                            <span dir="ltr">{emp.phone}</span>
                                        </div>
                                    )}
                                    {emp.whatsapp && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MessageCircle size={14} className="shrink-0 text-green-600" />
                                            <span dir="ltr">{emp.whatsapp}</span>
                                        </div>
                                    )}
                                    {emp.address && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin size={14} className="shrink-0" />
                                            <span className="line-clamp-1">{emp.address}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Login Credentials */}
                                {emp.username && (
                                    <div className="pt-6 mt-6 border-t border-white/10 relative">
                                        <div className={cn("text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3", isRTL && "text-right")}>
                                            {t('login_credentials')}
                                        </div>
                                        <div className="space-y-2 text-xs bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-400 font-bold uppercase tracking-tighter w-16">{t('username')}:</span>
                                                <span className="text-white font-mono font-bold tracking-tight" dir="ltr">{emp.username}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-slate-400 font-bold uppercase tracking-tighter w-16">{t('password')}:</span>
                                                <span className="text-slate-600 font-mono tracking-widest">••••••••</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative">
                                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white/5 text-slate-400 border border-white/5">
                                        {emp.department || t('general_dept')}
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm",
                                        emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                    )}>
                                        {t(emp.status.toLowerCase())}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className={cn("flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-card border border-border rounded-xl shadow-sm mt-8", isRTL && "md:flex-row-reverse")}>
                        <div className="text-sm text-muted-foreground font-medium">
                            {t('showing_page')} <span className="text-foreground font-bold">{currentPage}</span> {t('of')} <span className="text-foreground font-bold">{totalPages}</span>
                        </div>
                        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
                            <Link
                                href={getPageLink(1)}
                                className={cn(
                                    "w-10 h-10 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
                                    currentPage === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-secondary hover:border-primary text-foreground"
                                )}
                            >
                                <ChevronsLeft size={18} />
                            </Link>
                            <Link
                                href={getPageLink(currentPage - 1)}
                                className={cn(
                                    "w-10 h-10 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
                                    currentPage === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-secondary hover:border-primary text-foreground"
                                )}
                            >
                                <ChevronLeft size={18} />
                            </Link>

                            <div className="flex items-center gap-2 mx-2">
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <Link
                                            key={pageNum}
                                            href={getPageLink(pageNum)}
                                            className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300",
                                                currentPage === pageNum
                                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                                    : "border border-border hover:bg-secondary text-foreground"
                                            )}
                                        >
                                            {pageNum}
                                        </Link>
                                    );
                                })}
                            </div>

                            <Link
                                href={getPageLink(currentPage + 1)}
                                className={cn(
                                    "w-10 h-10 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
                                    currentPage === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-secondary hover:border-primary text-foreground"
                                )}
                            >
                                <ChevronRight size={18} />
                            </Link>
                            <Link
                                href={getPageLink(totalPages)}
                                className={cn(
                                    "w-10 h-10 rounded-lg border border-border flex items-center justify-center transition-all duration-300",
                                    currentPage === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-secondary hover:border-primary text-foreground"
                                )}
                            >
                                <ChevronsRight size={18} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
