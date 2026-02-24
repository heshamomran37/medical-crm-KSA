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
    Receipt
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { AddSaleDialog } from "./AddSaleDialog";
import { EditSaleDialog } from "./EditSaleDialog";
import { ExpenseDialog } from "./ExpenseDialog";

interface SalesPageClientProps {
    initialSales: any[];
    initialTotals: {
        total: number;
        cash: number;
        network: number;
        men: number;
        women: number;
    };
    monthlyStats: {
        totalSales: number;
        totalExpenses: number;
        netIncome: number;
        salesCount: number;
    };
    patients: any[];
}

export function SalesPageClient({ initialSales, initialTotals, monthlyStats, patients }: SalesPageClientProps) {
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
                    <ExpenseDialog />
                    <AddSaleDialog patients={patients} />
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={t('today_total') || "Today's Total"}
                    value={initialTotals.total}
                    icon={DollarSign}
                    color="bg-emerald-500/10 text-emerald-500"
                    isCurrency
                />
                <StatCard
                    title={t('cash') || "Cash"}
                    value={initialTotals.cash}
                    icon={Wallet}
                    color="bg-amber-500/10 text-amber-500"
                    isCurrency
                />
                <StatCard
                    title={t('network') || "Network"}
                    value={initialTotals.network}
                    icon={CreditCard}
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
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('monthly_revenue') || "Monthly Revenue"}</p>
                    <p className="text-2xl font-serif italic text-white mt-1">{monthlyStats.totalSales.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('monthly_expenses') || "Monthly Expenses"}</p>
                    <p className="text-2xl font-serif italic text-red-400 mt-1">{monthlyStats.totalExpenses.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden md:block" />
                <div className="text-center">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{t('net_income') || "Net Income"}</p>
                    <p className="text-2xl font-serif italic text-emerald-400 mt-1">{monthlyStats.netIncome.toLocaleString()} <span className="text-xs">SAR</span></p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-[#0a192f] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-serif italic text-white">{t('recent_sales') || "Recent Sessions"}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left" dir={isRTL ? "rtl" : "ltr"}>
                        <thead>
                            <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-6 py-4">{t('patient_name')}</th>
                                <th className="px-6 py-4">{t('gender')}</th>
                                <th className="px-6 py-4">{t('cups_count') || "Cups"}</th>
                                <th className="px-6 py-4">{t('disease_complaint') || "Complaint"}</th>
                                <th className="px-6 py-4">{t('total')}</th>
                                <th className="px-6 py-4">{t('method') || "Method"}</th>
                                <th className="px-6 py-4">{t('date')}</th>
                                <th className="px-6 py-4 text-center">{t('actions') || "Actions"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {initialSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-white font-medium">{sale.patient.name}</span>
                                            <span className="text-slate-500 text-xs">{sale.patient.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                            sale.gender === 'Male' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                                        )}>
                                            {t(sale.gender?.toLowerCase() || 'male')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 font-bold">{sale.cupsCount}</td>
                                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{sale.disease || "-"}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-white font-serif italic font-bold">{sale.totalAmount} <span className="text-[10px] text-slate-500">SAR</span></span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {sale.cashAmount > 0 && <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 uppercase tracking-tighter"><Wallet size={10} /> {t('cash')}: {sale.cashAmount}</span>}
                                            {sale.networkAmount > 0 && <span className="text-[10px] text-blue-500 font-bold flex items-center gap-1 uppercase tracking-tighter"><CreditCard size={10} /> {t('network')}: {sale.networkAmount}</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-[11px]">
                                        <div className="flex flex-col">
                                            <span className="text-slate-300 font-bold capitalize">
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleDateString('ar-SA', { weekday: 'long' })}
                                            </span>
                                            <span>
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                            </span>
                                            <span className="text-slate-500 text-[10px]">
                                                {new Date(sale.saleDate || sale.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <EditSaleDialog sale={sale} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {initialSales.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500 uppercase tracking-widest text-xs">
                                        {t('no_sales_today') || "No sessions recorded today."}
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
