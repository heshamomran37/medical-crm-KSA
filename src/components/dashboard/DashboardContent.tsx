"use client";

import React from 'react';
import { Users, UserPlus, FileText, TrendingUp, PlusCircle, Activity } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface DashboardContentProps {
    totalPatients: number;
    activeEmployees: number;
    appointmentsToday: number;
    revenue: number;
}

export default function DashboardContent({ totalPatients, activeEmployees, appointmentsToday, revenue }: DashboardContentProps) {
    const { t } = useLanguage();

    const stats = [
        { label: "total_patients", value: totalPatients.toString(), change: "Initial", icon: Users },
        { label: "active_employees", value: activeEmployees.toString(), change: "Initial", icon: UserPlus },
        { label: "appointments_today", value: appointmentsToday.toString(), change: "Initial", icon: FileText },
        { label: "revenue_monthly", value: `$${revenue}`, change: "Initial", icon: TrendingUp },
    ];

    const hasData = totalPatients > 0 || activeEmployees > 0;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold tracking-tighter text-[#0a192f] font-serif italic animate-fade-up">{t('dashboard')}</h1>
                    <p className="text-slate-500 font-medium mt-2 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        {t('welcome_command_center')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div
                        key={stat.label}
                        className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-[#0a192f]/5 transition-all duration-500 group cursor-default relative overflow-hidden animate-fade-up"
                        style={{ animationDelay: `${idx * 0.1 + 0.2}s` }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="p-4 rounded-2xl bg-slate-50 text-[#0a192f] group-hover:bg-[#0a192f] group-hover:text-white transition-all duration-300 shadow-sm">
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.change}</span>
                        </div>
                        <div>
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#b78a5d] block mb-2">{t(stat.label)}</span>
                            <span className="text-4xl font-serif italic text-[#0a192f]">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-[3rem] bg-white/50 border-2 border-dashed border-slate-200 animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <PlusCircle size={40} className="text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-serif italic text-[#0a192f] mb-2">{t('get_started_clinic')}</h3>
                    <p className="text-slate-500 max-w-md text-center mb-8">
                        {t('setup_guide')}
                    </p>
                    <div className="flex gap-4">
                        <Link href="/patients" className="px-8 py-4 bg-[#0a192f] text-white rounded-2xl font-bold transition-all hover:bg-[#b78a5d] shadow-xl hover:shadow-[#b78a5d]/30">
                            {t('add_patient')}
                        </Link>
                        <Link href="/employees" className="px-8 py-4 bg-white border border-slate-200 text-[#0a192f] rounded-2xl font-bold transition-all hover:bg-slate-50">
                            {t('setup_staff')}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.6s' }}>
                    <div className="lg:col-span-2 p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm min-h-[400px]">
                        <h3 className="text-lg font-bold text-[#0a192f] mb-8 font-serif italic">{t('patient_growth')}</h3>
                        <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                            <Activity size={32} className="mb-4 opacity-20" />
                            <span className="text-sm font-bold uppercase tracking-widest">{t('initializing_data')}</span>
                        </div>
                    </div>
                    <div className="p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-bold text-[#0a192f] mb-8 font-serif italic">{t('medical_alerts')}</h3>
                        <div className="space-y-6">
                            <div className="text-center py-10">
                                <p className="text-sm text-slate-400 font-medium">{t('no_alerts')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
