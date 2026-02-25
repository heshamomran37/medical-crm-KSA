"use client";

import { Search, Menu, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NotificationsDropdown } from "./NotificationsDropdown";

export default function Header() {
    const { language, setLanguage, t, isRTL } = useLanguage();
    const router = useRouter();

    return (
        <>
            <header className={cn(
                "h-16 border-b border-white/10 bg-[#0a192f] sticky top-0 z-50 px-6 flex items-center justify-between",
                isRTL && "flex-row-reverse"
            )}>
                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                    <button className="md:hidden p-2 hover:bg-white/5 rounded-md text-slate-400">
                        <Menu size={20} />
                    </button>
                    <div className="relative hidden md:block w-96">
                        <Search className={cn("absolute top-1/2 -translate-y-1/2 text-slate-500", isRTL ? "right-3" : "left-3")} size={16} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className={cn(
                                "w-full h-10 rounded-full bg-white/5 border border-white/5 text-sm text-white focus:outline-none focus:border-[#b78a5d]/50 placeholder:text-slate-600 transition-all",
                                isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                            )}
                        />
                    </div>
                </div>

                <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
                    {/* Language Switcher Tabs */}
                    <div className={cn("bg-white/5 p-1 rounded-xl flex items-center gap-1 border border-white/10", isRTL && "flex-row-reverse")}>
                        <button
                            onClick={() => setLanguage('en')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                language === 'en'
                                    ? "bg-[#b78a5d] text-white shadow-md shadow-[#b78a5d]/20"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('ar')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold font-arabic transition-all duration-300",
                                language === 'ar'
                                    ? "bg-[#b78a5d] text-white shadow-md shadow-[#b78a5d]/20"
                                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                            )}
                        >
                            العربية
                        </button>
                    </div>

                    <div className={cn(
                        "flex items-center gap-4 h-8",
                        isRTL ? "border-r border-white/10 pr-4" : "border-l border-white/10 pl-4"
                    )}>
                        {/* WhatsApp Button */}
                        <button
                            onClick={() => router.push('/whatsapp')}
                            className="p-2 relative hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors group"
                            title="Open WhatsApp"
                        >
                            <MessageCircle size={20} className="group-hover:text-[#25D366]" />
                        </button>

                        <NotificationsDropdown />
                    </div>
                </div>
            </header>
        </>
    );
}
