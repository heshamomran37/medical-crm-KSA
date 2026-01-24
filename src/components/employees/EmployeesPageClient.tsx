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
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('employees_title')}</h1>
                        <p className="text-muted-foreground mt-1">{t('employees_subtitle')}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <BackupRestoreButton />
                        <AddEmployeeDialog />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-lg bg-card border border-border shadow-sm">
                    <form className="contents">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRTL ? "right-3" : "left-3")} size={16} />
                            <input
                                name="q"
                                defaultValue={query}
                                type="text"
                                placeholder={t('search_employees')}
                                className={cn(
                                    "w-full h-9 rounded-md border border-input bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-primary/20",
                                    isRTL ? "pr-9 pl-4" : "pl-9 pr-4"
                                )}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 h-9 rounded-md border border-input bg-transparent text-sm hover:bg-secondary">
                            <Filter size={16} />
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
                            <div key={emp.id} className="relative group flex flex-col p-5 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                                            {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div className={cn(isRTL && "text-right")}>
                                            <h3 className="font-bold text-foreground truncate max-w-[180px]">{emp.name}</h3>
                                            <p className="text-sm font-medium text-primary">{emp.role}</p>
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
                                    <div className="pt-4 mt-4 border-t border-border">
                                        <div className={cn("text-xs font-semibold text-muted-foreground mb-2", isRTL && "text-right")}>
                                            {t('login_credentials')}
                                        </div>
                                        <div className="space-y-1 text-sm bg-secondary/50 p-2 rounded">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{t('username')}:</span>
                                                <span className="font-mono font-semibold" dir="ltr">{emp.username}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{t('password')}:</span>
                                                <span className="font-mono">••••••••</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-xs font-semibold px-2 py-1 rounded bg-secondary text-secondary-foreground">
                                        {emp.department || t('general_dept')}
                                    </span>
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded-full",
                                        emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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
