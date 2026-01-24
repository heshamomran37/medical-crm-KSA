"use client";

import React from "react";
import {
    Activity,
    ArrowRight,
    Users,
    MessageCircle,
    ShieldCheck,
    Zap,
    Instagram,
    Send,
    Globe
} from "lucide-react";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { InteractiveMockup } from "@/components/ui/InteractiveMockup";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function LandingPage() {
    const { t, language, setLanguage, isRTL } = useLanguage();

    return (
        <div className={cn("min-h-screen bg-[#0a192f] text-white selection:bg-[#06b6d4]/30", isRTL && "font-arabic")} dir={isRTL ? "rtl" : "ltr"}>
            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 bg-[#0a192f]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-[#06b6d4]/20 overflow-hidden border border-white/10">
                            <img src="/company-logo.jpg" alt="Rawad" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-2xl font-serif italic font-bold">MedCRM Elite</span>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#06b6d4]">by Rawad Al-Mati</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {/* Language Switcher Tabs */}
                        <div className="bg-white/5 p-1 rounded-xl flex items-center gap-1 border border-white/10">
                            <button
                                onClick={() => setLanguage('en')}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    language === 'en'
                                        ? "bg-[#06b6d4] text-white shadow-lg shadow-[#06b6d4]/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('ar')}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    language === 'ar'
                                        ? "bg-[#06b6d4] text-white shadow-lg shadow-[#06b6d4]/20"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                العربية
                            </button>
                        </div>

                        <div className="flex items-center gap-8 pl-8 border-l border-white/10">
                            <a href="#about" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#06b6d4] transition-colors">{t('about_us')}</a>
                            <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#06b6d4] transition-colors">{t('features')}</a>
                            <a href="#demo" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#06b6d4] transition-colors">{t('demo')}</a>
                            <a href="/login" className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                {t('portal_access')}
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <ParticleBackground color="#06b6d4" particleCount={100} opacity={0.3} />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className={cn("space-y-8 animate-fade-up", isRTL && "text-right")}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#06b6d4]/10 rounded-full border border-[#06b6d4]/20">
                                <div className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#06b6d4]">{t('v2_pre_release')}</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif italic leading-tight">
                                {t('hero_title_1')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06b6d4] to-blue-500">{t('hero_title_2')}</span>
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-xl font-medium">
                                {t('hero_subtitle')}
                            </p>
                            <div className="flex flex-wrap gap-4 pt-4 justify-start">
                                <a href="/login" className="px-10 py-5 bg-gradient-to-br from-[#06b6d4] to-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-[#06b6d4]/20 hover:scale-105 transition-all flex items-center gap-3">
                                    {t('get_started')}
                                    <ArrowRight size={20} className={cn(isRTL && "rotate-180")} />
                                </a>
                                <a href="#demo" className="px-10 py-5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-sm transition-all">
                                    {t('live_experience')}
                                </a>
                            </div>
                        </div>
                        <div className="relative lg:block hidden">
                            <div className="absolute -inset-4 bg-[#06b6d4]/20 blur-[100px] rounded-full"></div>
                            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-4 shadow-2xl">
                                <InteractiveMockup />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-32 relative bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="relative aspect-square rounded-[4rem] overflow-hidden border border-white/10 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a192f] to-transparent z-10"></div>
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-21735994b22c?auto=format&fit=crop&q=80&w=1200"
                                alt="Medical Technology"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className={cn("absolute bottom-12 z-20 space-y-4", isRTL ? "right-12" : "left-12")}>
                                <div className="w-20 h-1 bg-[#06b6d4] rounded-full"></div>
                                <h3 className="text-4xl font-serif italic text-white">{t('innovation_first')}</h3>
                            </div>
                        </div>
                        <div className={cn("space-y-10", isRTL ? "text-right" : "text-left")}>
                            <div className="space-y-4">
                                <h2 className="text-5xl font-serif italic text-[#06b6d4]">{t('about_us')}</h2>
                                <p className="text-2xl text-slate-300 font-medium leading-relaxed">
                                    {t('innovators_team')}
                                </p>
                            </div>
                            <div className="space-y-6 text-slate-400 leading-loose text-lg">
                                <p>
                                    {t('doctor_focus')}
                                </p>
                                <div className={cn("grid grid-cols-2 gap-8 pt-8", isRTL ? "text-right" : "text-left")}>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-serif text-white italic">150+</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#06b6d4]">{t('active_clinic')}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-3xl font-serif text-white italic">100%</div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-[#06b6d4]">{t('customer_satisfaction')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Intelligence Bento Grid Features */}
            <section id="features" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4 animate-fade-up">
                        <h2 className="text-5xl md:text-6xl font-serif italic text-white">{t('feat_bento_title')}</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-medium">{t('feat_bento_subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 auto-rows-[240px]">
                        {/* Unified Inbox - Large / Main feature */}
                        <div className="md:col-span-6 lg:col-span-8 row-span-2 group relative overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-10 hover:border-[#06b6d4]/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-[#0a192f] border border-[#06b6d4]/30 flex items-center justify-center text-[#06b6d4]">
                                        <MessageCircle size={32} />
                                    </div>
                                    <h3 className="text-3xl font-serif italic text-white">{t('feat_unified_inbox_title')}</h3>
                                    <p className="text-slate-400 max-w-sm leading-relaxed">{t('feat_unified_inbox_desc')}</p>
                                </div>
                                <div className="flex gap-4 items-center pt-8">
                                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">WhatsApp</div>
                                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">Messenger</div>
                                    <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest">Instagram</div>
                                </div>
                            </div>
                        </div>

                        {/* Decision Reporting */}
                        <div className="md:col-span-3 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-8 hover:border-[#06b6d4]/50 transition-all duration-500">
                            <div className="space-y-4">
                                <Zap className="text-amber-500" size={24} />
                                <h4 className="text-xl font-serif italic text-white">{t('feat_analytics_title')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('feat_analytics_desc')}</p>
                            </div>
                        </div>

                        {/* Process Automation */}
                        <div className="md:col-span-3 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-[3rem] bg-white/[0.1] border border-[#06b6d4]/30 p-8 hover:border-[#06b6d4] transition-all duration-500 shadow-2xl shadow-[#06b6d4]/5">
                            <div className="space-y-4">
                                <Activity className="text-[#06b6d4]" size={24} />
                                <h4 className="text-xl font-serif italic text-white">{t('feat_automation_title')}</h4>
                                <p className="text-xs text-slate-200 leading-relaxed font-medium">{t('feat_automation_desc')}</p>
                            </div>
                        </div>

                        {/* Lead Capture */}
                        <div className="md:col-span-2 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-8 hover:border-[#06b6d4]/50 transition-all duration-500">
                            <div className="space-y-4">
                                <ArrowRight className={cn("text-[#06b6d4] transition-transform group-hover:translate-x-2", isRTL && "rotate-180")} size={24} />
                                <h4 className="text-xl font-serif italic text-white">{t('feat_lead_capture_title')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('feat_lead_capture_desc')}</p>
                            </div>
                        </div>

                        {/* Digital Archiving */}
                        <div className="md:col-span-2 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-8 hover:border-[#06b6d4]/50 transition-all duration-500">
                            <div className="space-y-4">
                                <ShieldCheck className="text-emerald-500" size={24} />
                                <h4 className="text-xl font-serif italic text-white">{t('feat_archiving_title')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('feat_archiving_desc')}</p>
                            </div>
                        </div>

                        {/* Team Coordination */}
                        <div className="md:col-span-2 lg:col-span-4 row-span-1 group relative overflow-hidden rounded-[3rem] bg-white/[0.03] border border-white/10 p-8 hover:border-[#06b6d4]/50 transition-all duration-500">
                            <div className="space-y-4">
                                <Users className="text-blue-500" size={24} />
                                <h4 className="text-xl font-serif italic text-white">{t('feat_team_sync_title')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">{t('feat_team_sync_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section id="demo" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-serif italic">{t('interactive_experience')}</h2>
                        <p className="text-slate-400 font-medium">{t('doctors_love')}</p>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-10 bg-[#06b6d4]/10 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        <InteractiveMockup />
                    </div>
                </div>
            </section>

            {/* Contact & Footer */}
            <footer className="py-20 border-t border-white/5 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-4 gap-12 mb-20">
                        <div className={cn("col-span-1 md:col-span-2 space-y-8", isRTL ? "text-right" : "text-left")}>
                            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-white/10">
                                    <img src="/company-logo.jpg" alt="Rawad" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-2xl font-serif italic font-bold">MedCRM Elite</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-[#06b6d4]">Rawad Al-Mati Tech</span>
                                </div>
                            </div>
                            <p className={cn("text-slate-400 max-w-sm leading-relaxed font-medium", isRTL && "mr-0 ml-auto")}>
                                {t('about_narrative')}
                            </p>
                        </div>
                        <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
                            <h4 className="text-sm font-black uppercase tracking-widest text-[#06b6d4]">{t('contact')}</h4>
                            <div className="flex flex-col gap-4">
                                <a href="https://wa.me/966561917480" target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 text-slate-400 hover:text-white transition-colors group", isRTL && "flex-row-reverse")}>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20">
                                        <MessageCircle size={18} className="text-slate-400 group-hover:text-emerald-500" />
                                    </div>
                                    <span className="font-bold">WhatsApp</span>
                                </a>
                                <a href="#" className={cn("flex items-center gap-3 text-slate-400 hover:text-white transition-colors group", isRTL && "flex-row-reverse")}>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-pink-500/20">
                                        <Instagram size={18} className="text-slate-400 group-hover:text-pink-500" />
                                    </div>
                                    <span className="font-bold">Instagram</span>
                                </a>
                                <a href="tel:+966561917480" className={cn("flex items-center gap-3 text-slate-400 hover:text-white transition-colors group", isRTL && "flex-row-reverse")}>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#06b6d4]/20">
                                        <Globe size={18} className="text-slate-400 group-hover:text-[#06b6d4]" />
                                    </div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#06b6d4] mb-1">{isRTL ? 'اتصل بنا' : 'Call Us'}</span>
                                        <span className="font-bold" dir="ltr">056 1917 480</span>
                                    </div>
                                </a>
                                <a href="#" className={cn("flex items-center gap-3 text-slate-400 hover:text-white transition-colors group", isRTL && "flex-row-reverse")}>
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-blue-400/20">
                                        <Send size={18} className="text-slate-400 group-hover:text-blue-400" />
                                    </div>
                                    <span className="font-bold">Telegram</span>
                                </a>
                            </div>
                        </div>
                        <div className={cn("space-y-6", isRTL ? "text-right" : "text-left")}>
                            <h4 className="text-sm font-black uppercase tracking-widest text-[#b78a5d]">{t('operations')}</h4>
                            <div className="flex flex-col gap-3 text-slate-400 font-bold text-sm">
                                <a href="/login" className="hover:text-white transition-colors">{t('portal_access')}</a>
                                <a href="#" className="hover:text-white transition-colors">{t('support_center')}</a>
                                <a href="#" className="hover:text-white transition-colors">{t('terms_service')}</a>
                            </div>
                        </div>
                    </div>
                    <div className={cn("pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4", isRTL && "md:flex-row-reverse")}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('all_rights_reserved')}</p>
                        <div className={cn("flex items-center gap-4 text-slate-500", isRTL && "flex-row-reverse")}>
                            <Globe size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('global_standards')}</span>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
