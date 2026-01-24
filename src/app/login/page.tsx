"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions";
import { Activity, Lock, User, ArrowRight, Zap } from "lucide-react";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [errorMessage, dispatch] = useActionState(authenticate, undefined);
    const { t, isRTL } = useLanguage();

    return (
        <div
            className={cn(
                "min-h-screen bg-[#0a192f] flex items-center justify-center p-4 relative overflow-hidden",
                isRTL && "font-arabic"
            )}
            dir={isRTL ? "rtl" : "ltr"}
        >
            {/* Dynamic Spider Web - Tech Layer */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <ParticleBackground color="#b78a5d" particleCount={120} linkDistance={200} opacity={0.3} />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f]/80 via-transparent to-[#0a192f]/80"></div>
                {/* Advanced Light Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#b78a5d]/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md animate-fade-up relative z-10">
                <div className="bg-white/95 backdrop-blur-2xl p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center p-1 bg-white rounded-[2rem] shadow-2xl shadow-[#0a192f]/10 mb-4 ring-8 ring-white/50 overflow-hidden w-28 h-28 mx-auto">
                            <img src="/company-logo.jpg" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tighter text-[#0a192f] font-serif italic">MedCRM</h1>
                        <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px]">{t('prof_med_intel')}</p>
                    </div>

                    <form action={dispatch} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <label className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2", isRTL && "text-right block mr-2 ml-0")}>
                                {t('username')}
                            </label>
                            <div className="relative group">
                                <div className={cn(
                                    "absolute inset-y-0 flex items-center pointer-events-none transition-colors group-focus-within:text-[#b78a5d]",
                                    isRTL ? "right-1.5" : "left-1.5"
                                )}>
                                    <div className="w-8 h-8 rounded-xl bg-slate-100/50 flex items-center justify-center">
                                        <User size={16} className="text-slate-400 group-focus-within:text-[#b78a5d]" />
                                    </div>
                                </div>
                                <input
                                    name="username"
                                    type="text"
                                    className={cn(
                                        "block w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d]/30 font-bold text-[#0a192f] transition-all outline-none placeholder:text-slate-300",
                                        isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                                    )}
                                    placeholder={t('enter_username')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2", isRTL && "text-right block mr-2 ml-0")}>
                                {t('password')}
                            </label>
                            <div className="relative group">
                                <div className={cn(
                                    "absolute inset-y-0 flex items-center pointer-events-none transition-colors group-focus-within:text-[#b78a5d]",
                                    isRTL ? "right-1.5" : "left-1.5"
                                )}>
                                    <div className="w-8 h-8 rounded-xl bg-slate-100/50 flex items-center justify-center">
                                        <Lock size={16} className="text-slate-400 group-focus-within:text-[#b78a5d]" />
                                    </div>
                                </div>
                                <input
                                    name="password"
                                    type="password"
                                    className={cn(
                                        "block w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d]/30 font-bold text-[#0a192f] transition-all outline-none placeholder:text-slate-300",
                                        isRTL ? "pr-12 pl-4 text-right" : "pl-12 pr-4"
                                    )}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 text-red-600 text-[11px] font-bold p-4 rounded-2xl text-center border border-red-100 animate-in fade-in slide-in-from-top-1">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            className={cn(
                                "w-full h-14 bg-[#0a192f] hover:bg-[#b78a5d] text-white rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-2xl hover:shadow-[#b78a5d]/40 active:scale-[0.98] flex items-center justify-center gap-3 group",
                                isRTL && "flex-row-reverse"
                            )}
                        >
                            {t('access_portal')}
                            <ArrowRight size={18} className={cn("transition-transform", isRTL ? "group-hover:-translate-x-1 rotate-180" : "group-hover:translate-x-1")} />
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-slate-100 flex flex-col gap-4">
                        <button
                            onClick={() => {
                                const formData = new FormData();
                                formData.append('username', 'demo_admin');
                                formData.append('password', 'demo123');
                                dispatch(formData);
                            }}
                            className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-emerald-100 flex items-center justify-center gap-2"
                        >
                            <Zap size={14} fill="currentColor" />
                            {isRTL ? 'دخول سريع للمعاينة (Demo)' : 'Quick Demo Access'}
                        </button>
                        <div className={cn("inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 mx-auto", isRTL && "flex-row-reverse")}>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('system_secure_online')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
