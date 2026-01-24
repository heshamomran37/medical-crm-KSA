"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Activity, Sparkles } from "lucide-react";
import { useChat } from "ai/react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export function MedicalChatbot() {
    const { t, isRTL } = useLanguage();
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={cn("fixed bottom-6 z-[100] transition-all duration-500", isRTL ? "left-6" : "right-6")}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-[#0a192f] text-[#b78a5d] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform relative group"
            >
                <div className="absolute inset-0 rounded-full bg-[#b78a5d]/20 animate-ping group-hover:animate-none"></div>
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
                {!isOpen && (
                    <div className={cn(
                        "absolute px-4 py-2 bg-white text-[#0a192f] text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl whitespace-nowrap -top-12 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100",
                        isRTL ? "left-0" : "right-0"
                    )}>
                        {t('ask_ai')}
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className={cn(
                    "absolute bottom-20 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-10 duration-500",
                    isRTL ? "left-0" : "right-0",
                    isRTL && "text-right"
                )} dir={isRTL ? "rtl" : "ltr"}>
                    {/* Header */}
                    <div className={cn("p-6 bg-[#0a192f] text-white flex items-center gap-4", isRTL && "flex-row-reverse")}>
                        <div className="w-12 h-12 rounded-2xl bg-[#b78a5d] flex items-center justify-center shadow-lg shadow-[#b78a5d]/30">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h3 className="font-serif italic text-lg leading-none">{t('ai_concierge')}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] mt-1 opacity-80">{t('online_ready')}</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-dot-slate-200 custom-scrollbar">
                        {messages.length === 0 && (
                            <div className="text-center py-10 animate-fade-in">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                    <Sparkles size={32} className="text-[#b78a5d] animate-pulse" />
                                </div>
                                <h4 className="text-[#0a192f] font-serif italic text-xl mb-2">{t('how_assist')}</h4>
                                <div className={cn("flex flex-wrap justify-center gap-2 mt-6", isRTL && "flex-row-reverse")}>
                                    <button onClick={() => handleInputChange({ target: { value: t('pricing_fees') } } as React.ChangeEvent<HTMLInputElement>)} className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-[#0a192f] hover:text-white transition-all">{t('pricing_fees')}</button>
                                    <button onClick={() => handleInputChange({ target: { value: t('booking_inquiries') } } as React.ChangeEvent<HTMLInputElement>)} className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-[#0a192f] hover:text-white transition-all">{t('booking_inquiries')}</button>
                                </div>
                            </div>
                        )}

                        {messages.map((m) => (
                            <div key={m.id} className={cn("flex flex-col", m.role === 'user' ? (isRTL ? "items-start" : "items-end") : (isRTL ? "items-end" : "items-start"))}>
                                <div className={cn(
                                    "max-w-[85%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                                    m.role === 'user'
                                        ? "bg-[#0a192f] text-white rounded-tr-none"
                                        : "bg-slate-100 text-slate-600 rounded-tl-none border border-slate-200",
                                    isRTL && (m.role === 'user' ? "rounded-tr-2xl rounded-tl-none" : "rounded-tl-2xl rounded-tr-none")
                                )}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={cn("flex", isRTL ? "justify-end" : "justify-start")}>
                                <div className={cn("bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200", isRTL && "rounded-tl-2xl rounded-tr-none")}>
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-slate-50/50">
                        <div className="relative">
                            <input
                                value={input}
                                onChange={handleInputChange}
                                placeholder={t('type_inquiry')}
                                className={cn(
                                    "w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#b78a5d]/50 transition-all shadow-sm",
                                    isRTL ? "pl-16 pr-6 text-right" : "pr-16 pl-6"
                                )}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className={cn(
                                    "absolute top-2 bottom-2 w-12 rounded-xl bg-[#0a192f] text-white flex items-center justify-center hover:bg-[#b78a5d] disabled:opacity-50 transition-all shadow-lg",
                                    isRTL ? "left-2" : "right-2"
                                )}
                            >
                                <Send size={18} className={cn(isRTL && "rotate-180")} />
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
