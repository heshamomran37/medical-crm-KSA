"use client";

import React, { useState, useEffect } from 'react';
import {
    Users,
    Activity,
    Search,
    Plus,
    MoreHorizontal,
    MessageCircle,
    LayoutDashboard,
    UserCircle,
    Settings,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export const InteractiveMockup = () => {
    const { t, isRTL } = useLanguage();
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState([
        { labelKey: 'today_patients', value: 12, trend: '+4' },
        { labelKey: 'active_staff', value: 24, trend: 'stable' },
        { labelKey: 'revenue_monthly', value: '$4.2k', trend: '+12%' }
    ]);

    // Simulate real-time updates for that "Live" feel
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => prev.map(s =>
                s.labelKey === 'today_patients' && typeof s.value === 'number'
                    ? { ...s, value: s.value + (Math.random() > 0.8 ? 1 : 0) }
                    : s
            ));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const mockPatients = [
        { name: 'Sarah Ahmed', age: 34, statusKey: 'completed', typeKey: 'checkup' },
        { name: 'John Doe', age: 45, statusKey: 'in_progress', typeKey: 'laboratory' },
        { name: 'Emma Wilson', age: 28, statusKey: 'pending', typeKey: 'consultation' }
    ].filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className={cn(
            "w-full max-w-6xl mx-auto bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(10,25,47,0.15)] border border-slate-100 overflow-hidden flex flex-col md:flex-row h-[600px] animate-fade-up",
            isRTL && "md:flex-row-reverse"
        )} dir={isRTL ? "rtl" : "ltr"}>
            {/* Mock Sidebar */}
            <div className="w-20 md:w-64 bg-[#0a192f] p-6 flex flex-col gap-8">
                <div className={cn("flex items-center gap-3 px-2", isRTL && "flex-row-reverse")}>
                    <div className="w-8 h-8 rounded-lg bg-[#b78a5d] flex items-center justify-center text-white shrink-0">
                        <Activity size={18} />
                    </div>
                    <span className="text-white font-serif italic text-xl hidden md:block">MedCRM</span>
                </div>

                <nav className="flex flex-col gap-2">
                    {[
                        { icon: LayoutDashboard, labelKey: 'overview' },
                        { icon: UserCircle, labelKey: 'patients' },
                        { icon: Users, labelKey: 'staff' },
                        { icon: MessageCircle, labelKey: 'whatsapp' },
                        { icon: Settings, labelKey: 'settings' }
                    ].map((item) => (
                        <div
                            key={item.labelKey}
                            onClick={() => setActiveTab(item.labelKey)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all",
                                activeTab === item.labelKey ? "bg-[#b78a5d] text-white" : "text-slate-400 hover:text-white",
                                isRTL && "flex-row-reverse"
                            )}
                        >
                            <item.icon size={20} />
                            <span className={cn("font-bold text-xs uppercase tracking-widest hidden md:block", isRTL && "text-right flex-1")}>{t(item.labelKey)}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Mock Content Area */}
            <div className={cn("flex-1 bg-slate-50 p-8 overflow-y-auto custom-scrollbar", isRTL && "text-right")}>
                <div className={cn("flex justify-between items-center mb-8", isRTL && "flex-row-reverse")}>
                    <div>
                        <h3 className="text-2xl font-serif italic font-bold text-[#0a192f]">{t(activeTab)}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('simulated_live')}</p>
                    </div>
                    <div className={cn("flex gap-3", isRTL && "flex-row-reverse")}>
                        <div className="relative hidden lg:block">
                            <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300", isRTL ? "right-3" : "left-3")} size={16} />
                            <input
                                type="text"
                                placeholder={t('universal_search')}
                                className={cn(
                                    "bg-white border-0 rounded-xl h-10 text-xs font-bold shadow-sm focus:ring-2 focus:ring-[#b78a5d]/20 outline-none w-64",
                                    isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-[#0a192f] text-white flex items-center justify-center shadow-lg shadow-[#0a192f]/20 hover:bg-[#b78a5d] transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Mock Stats Grid */}
                <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8", isRTL && "flex-row-reverse")}>
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{t(s.labelKey)}</p>
                            <div className={cn("flex items-end justify-between", isRTL && "flex-row-reverse")}>
                                <span className="text-3xl font-serif italic text-[#0a192f]">{s.value}</span>
                                <span className={cn(
                                    "text-[9px] font-bold px-2 py-1 rounded-full",
                                    s.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
                                )}>{s.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mock Table/List */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className={cn("p-6 border-b border-slate-50 flex justify-between items-center", isRTL && "flex-row-reverse")}>
                        <h4 className="font-bold text-sm text-[#0a192f]">{t('recent_db_hits')}</h4>
                        <TrendingUp size={16} className="text-[#b78a5d]" />
                    </div>
                    <div className="divide-y divide-slate-50">
                        {mockPatients.map((p, i) => (
                            <div key={i} className={cn("p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group", isRTL && "flex-row-reverse")}>
                                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#0a192f] font-bold text-xs">
                                        {p.name[0]}
                                    </div>
                                    <div className={isRTL ? "text-right" : "text-left"}>
                                        <p className="text-sm font-bold text-[#0a192f]">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">{t(p.typeKey)} • {t('age')}: {p.age}</p>
                                    </div>
                                </div>
                                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                        p.statusKey === 'completed' ? "bg-emerald-50 text-emerald-600" :
                                            p.statusKey === 'in_progress' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                                    )}>
                                        {t(p.statusKey)}
                                    </span>
                                    <button className="text-slate-300 group-hover:text-slate-500 transition-colors">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
