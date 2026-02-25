"use client";

import { useState } from "react";
import {
    DollarSign,
    Users,
    User,
    CreditCard,
    Wallet,
    Plus,
    TrendingUp,
    Receipt,
    Trash2
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { deleteSale } from "@/lib/actions";
import { AddSaleDialog } from "./AddSaleDialog";
import { EditSaleDialog } from "./EditSaleDialog";
import { ExpenseDialog } from "./ExpenseDialog";

import { ResetDataDialog } from "./ResetDataDialog";

interface SalesPageClientProps {
    initialSales: any[];
    initialTotals: {
        total: number;
        cash: number;
        network: number;
        men: number;
        women: number;
    };
    analytics: {
        daily: number;
        weekly: number;
        monthly: number;
        expenses: number;
        net: number;
        salesCount: number;
        todayCount: number;
    };
    patients: any[];
    isAdmin?: boolean;
}

export function SalesPageClient({ initialSales, initialTotals, analytics, patients, isAdmin = false }: SalesPageClientProps) {
    const { t, isRTL } = useLanguage();
    const [view, setView] = useState<'daily' | 'monthly'>('daily');

    return (
        <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-4", isRTL && "md:flex-row-reverse")}>
                <div className={isRTL ? "text-right" : ""}>
                    <h1 className="text-3xl font-serif italic text-white flex items-center gap-3">
                        <TrendingUp className="text-[#b78a5d]" />
                        {t('sales')}
                    </h1>
                    <p className="text-slate-400 mt-1">{t('manage_sales_desc') || "Track sessions, payments, and clinic performance."}</p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && <ResetDataDialog />}
                    <ExpenseDialog />
                    <AddSaleDialog patients={patients} />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('revenue_daily')}
                    value={analytics.daily}
                    icon={DollarSign}
                    color="bg-emerald-500/10 text-emerald-500"
                    isCurrency
                />
                <StatCard
                    title={t('revenue_weekly')}
                    value={analytics.weekly}
                    icon={TrendingUp}
                    color="bg-amber-500/10 text-[#b78a5d]"
                    isCurrency
                />
                <StatCard
                    title={t('revenue_monthly')}
                    value={analytics.monthly}
                    icon={Receipt}
                    color="bg-blue-500/10 text-blue-500"
                    isCurrency
                />
                <div className="grid grid-cols-2 gap-2">
                    <MiniStatCard
                        title={t('men') || "Men"}
                        value={initialTotals.men}
                        icon={User}
                        color="text-blue-400"
                    />
                    <MiniStatCard
                        title={t('women') || "Women"}
                        value={initialTotals.women}
                        icon={User}
                        color="text-pink-400"
                    />
                </div>
            </div>

            {/* Monthly Summary Bar */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-wrap items-center justify-around gap-8">
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('monthly_revenue')}</p>
                    <p className="text-2xl font-serif italic text-white mt-1">{analytics.monthly.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('monthly_expenses')}</p>
                    <p className="text-2xl font-serif italic text-red-400 mt-1">{analytics.expenses.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('net_income')}</p>
                    <p className="text-2xl font-serif italic text-emerald-400 mt-1">{analytics.net.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="relative group/table overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a192f] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse" dir={isRTL ? "rtl" : "ltr"}>
                        <thead className="bg-[#0f172a] text-[11px] font-black uppercase tracking-[0.2em] text-white border-b border-white/10">
                            <tr>
                                <th className="px-8 py-6">{t('patient_name')}</th>
                                <th className="px-6 py-6 text-center">{t('gender')}</th>
                                <th className="px-6 py-6">{t('cups_count')}</th>
                                <th className="px-6 py-6">{t('disease_complaint')}</th>
                                <th className="px-6 py-6">{t('total')}</th>
                                <th className="px-6 py-6 font-bold">{t('method')}</th>
                                <th className="px-6 py-6">{t('date')}</th>
                                <th className="px-8 py-6 text-center">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {initialSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/[0.05] even:bg-white/[0.02] transition-all group/row border-transparent">
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-white font-bold tracking-tight text-sm group-hover/row:text-[#b78a5d] transition-colors">{sale.patient.name}</span>
                                            <span className="text-slate-500 text-[10px] font-mono tracking-widest mt-0.5">{sale.patient.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className={cn(
                                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-block border",
                                            sale.gender === 'Male' ? "bg-blue-500/5 text-blue-400 border-blue-500/20" : "bg-pink-500/5 text-pink-400 border-pink-500/20"
                                        )}>
                                            {t(sale.gender?.toLowerCase() || 'male')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-black text-lg font-serif italic">{sale.cupsCount}</span>
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter line-clamp-1">{t('cups')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-300 text-xs max-w-xs truncate font-medium">
                                        {sale.disease || <span className="opacity-40 italic">---</span>}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-base font-serif italic tracking-tight">{sale.totalAmount}</span>
                                            <span className="text-[9px] text-[#b78a5d] font-black uppercase tracking-[0.2em]">{t('sar')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex flex-col gap-1.5 min-w-[80px]">
                                            {sale.cashAmount > 0 && (
                                                <span className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20 flex items-center justify-center gap-1.5 shadow-sm shadow-amber-500/10">
                                                    <Wallet size={10} /> {sale.cashAmount}
                                                </span>
                                            )}
                                            {sale.networkAmount > 0 && (
                                                <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/10">
                                                    <CreditCard size={10} /> {sale.networkAmount}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col items-start gap-0.5">
                                            <span className="text-slate-300 font-black text-[10px] uppercase tracking-wider">
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleDateString('ar-SA', { weekday: 'short' })}
                                            </span>
                                            <span className="text-slate-500 text-[11px] font-medium">
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleDateString('ar-SA', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                            <span className="bg-white/5 px-2 py-0.5 rounded text-slate-400 text-[9px] font-bold mt-1">
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex justify-center items-center gap-2 transition-all">
                                            <EditSaleDialog sale={sale} />
                                            <button
                                                onClick={async () => {
                                                    if (confirm(t('confirm_delete_sale') || "Are you sure you want to delete this sale?")) {
                                                        await deleteSale(sale.id);
                                                    }
                                                }}
                                                className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all active:scale-95 border border-white/5 hover:border-red-500/30"
                                                title={t('delete')}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {initialSales.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-24 text-center">
                                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5 opacity-50">
                                            <Receipt size={32} className="text-slate-600" />
                                        </div>
                                        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] font-black">
                                            {t('no_sales_today') || "No sessions recorded today."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, isCurrency = false }: any) {
    return (
        <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden group hover:border-[#b78a5d]/30 transition-all">
            <div className={cn("absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-white")}>
                <Icon size={80} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                    <p className="text-2xl font-serif italic text-white mt-1">
                        {value.toLocaleString()} {isCurrency && <span className="text-xs font-normal opacity-50">SAR</span>}
                    </p>
                </div>
            </div>
        </div>
    );
}

function MiniStatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-[#0a192f] border border-white/5 rounded-3xl p-4 flex flex-col justify-center items-center text-center">
            <Icon size={16} className={cn("mb-1", color)} />
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">{title}</p>
            <p className="text-lg font-serif italic text-white">{value}</p>
        </div>
    );
}
