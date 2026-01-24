"use client";

import React, { useState, useEffect } from 'react';
import {
    Zap,
    ShieldCheck,
    MessageCircle,
    Activity,
    ChevronRight,
    Search,
    Lock,
    Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SCENES = [
    {
        id: 'speed',
        title: 'Instantaneous Intelligence',
        subtitle: 'Powered by High-Performance Architecture',
        icon: Zap,
        color: 'text-amber-500',
        bgColor: 'bg-amber-500/10',
        description: 'Experience clinical software that moves at the speed of thought. Zero lag, zero friction.'
    },
    {
        id: 'security',
        title: 'Sovereign Security',
        subtitle: 'Military-Grade Data Protection',
        icon: ShieldCheck,
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-500/10',
        description: 'Your medical data is inviolable. Built with enterprise-grade encryption and secure RBAC.'
    },
    {
        id: 'whatsapp',
        title: 'Seamless Connection',
        subtitle: 'Direct Patient Engagement',
        icon: MessageCircle,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        description: 'Native WhatsApp integration bridges the gap between your clinic and your patients instantly.'
    }
];

export const MotionGraphicsTour = () => {
    const [currentScene, setCurrentScene] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setCurrentScene(s => (s + 1) % SCENES.length);
                    return 0;
                }
                return prev + 1;
            });
        }, 60); // Roughly 6 seconds per scene

        return () => clearInterval(interval);
    }, []);

    const scene = SCENES[currentScene];

    return (
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center bg-white/40 backdrop-blur-3xl rounded-[4rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-medical"></div>
            </div>

            {/* Visual Stage */}
            <div className="relative aspect-square bg-[#0a192f] rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl z-10">
                <div className="absolute inset-0 bg-dot-blue opacity-[0.05]"></div>

                {/* Dynamic Animation Container */}
                <div className="relative w-full h-full flex items-center justify-center p-20">
                    {currentScene === 0 && (
                        <div className="relative animate-in zoom-in-50 duration-700 w-full h-full flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Activity className="text-[#b78a5d] w-64 h-64 opacity-10 animate-pulse" />
                            </div>
                            <div className="relative space-y-4 w-full">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-12 bg-white/5 rounded-2xl flex items-center px-6 gap-4 border border-white/10 animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                        <Search className="text-[#b78a5d]/60" size={18} />
                                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-transparent via-[#b78a5d] to-transparent w-[30%] animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                ))}
                                <div className="text-center pt-8">
                                    <Cpu className="text-amber-500 w-12 h-12 mx-auto animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentScene === 1 && (
                        <div className="relative animate-in slide-in-from-right-20 duration-700 w-full h-full flex flex-col items-center justify-center">
                            <div className="w-48 h-48 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                <ShieldCheck className="text-emerald-500 w-24 h-24" />
                            </div>
                            <div className="mt-12 flex gap-4">
                                <Lock className="text-white/20" />
                                <Lock className="text-emerald-500" />
                                <Lock className="text-white/20" />
                            </div>
                        </div>
                    )}

                    {currentScene === 2 && (
                        <div className="relative animate-in slide-in-from-bottom-20 duration-700 w-full h-full flex flex-col items-center justify-center">
                            <div className="space-y-6 w-full max-w-sm">
                                <div className="bg-[#b78a5d] p-4 rounded-3xl rounded-bl-none text-white font-bold text-sm shadow-xl ml-auto animate-fade-up">
                                    Patient: &quot;Can I book a checkup?&quot;
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl rounded-br-none text-white font-bold text-sm border border-white/20 mr-auto animate-fade-up" style={{ animationDelay: '1s' }}>
                                    MedCRM: &quot;Session initialized instantly.&quot;
                                </div>
                                <div className="flex justify-center pt-10">
                                    <MessageCircle className="text-blue-400 w-16 h-16 animate-pulse" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status HUD */}
                <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">System Core Rendering</span>
                    </div>
                    <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#b78a5d]" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Content Sidebar */}
            <div className="space-y-12">
                <div className="space-y-4">
                    <div className={cn("inline-flex items-center justify-center p-4 rounded-[1.5rem] shadow-xl", scene.bgColor)}>
                        <scene.icon className={scene.color} size={36} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-serif italic font-bold text-[#0a192f] transition-all duration-500">{scene.title}</h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">{scene.subtitle}</p>
                    </div>
                    <p className="text-lg text-slate-500 leading-relaxed font-medium transition-all duration-500">
                        {scene.description}
                    </p>
                </div>

                <div className="space-y-6">
                    {SCENES.map((s, i) => (
                        <div
                            key={s.id}
                            onClick={() => { setCurrentScene(i); setProgress(0); }}
                            className={cn(
                                "flex items-center justify-between p-6 rounded-3xl border transition-all cursor-pointer group",
                                currentScene === i
                                    ? "bg-white border-[#b78a5d] shadow-xl"
                                    : "bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                    currentScene === i ? s.bgColor : "bg-slate-200"
                                )}>
                                    <s.icon size={20} className={currentScene === i ? s.color : "text-slate-400"} />
                                </div>
                                <span className={cn(
                                    "font-black uppercase tracking-widest text-[11px]",
                                    currentScene === i ? "text-[#0a192f]" : "text-slate-400"
                                )}>{s.title}</span>
                            </div>
                            <ChevronRight size={18} className={cn(
                                "transition-all",
                                currentScene === i ? "text-[#b78a5d] translate-x-1" : "text-slate-300 opacity-0 group-hover:opacity-100"
                            )} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
