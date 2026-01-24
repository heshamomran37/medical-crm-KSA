"use client";

import { Bell, Search, Menu, MessageCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Header() {
    const { language, setLanguage, t, isRTL } = useLanguage();
    const router = useRouter();

    return (
        <>
            <header className={cn(
                "h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between",
                isRTL && "flex-row-reverse"
            )}>
                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
                    <button className="md:hidden p-2 hover:bg-secondary rounded-md">
                        <Menu size={20} />
                    </button>
                    <div className="relative hidden md:block w-96">
                        <Search className={cn("absolute top-1/2 -translate-y-1/2 text-muted-foreground", isRTL ? "right-3" : "left-3")} size={16} />
                        <input
                            type="text"
                            placeholder={t('search_placeholder')}
                            className={cn(
                                "w-full h-10 rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                                isRTL ? "pr-10 pl-4 text-right" : "pl-10 pr-4"
                            )}
                        />
                    </div>
                </div>

                <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
                    {/* Language Switcher Tabs */}
                    <div className={cn("bg-secondary/50 p-1 rounded-xl flex items-center gap-1 border border-border/50", isRTL && "flex-row-reverse")}>
                        <button
                            onClick={() => setLanguage('en')}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                language === 'en'
                                    ? "bg-[#b78a5d] text-white shadow-md shadow-[#b78a5d]/20"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
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
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                            )}
                        >
                            العربية
                        </button>
                    </div>

                    <div className={cn(
                        "flex items-center gap-4 h-8",
                        isRTL ? "border-r border-border/50 pr-6" : "border-l border-border/50 pl-6"
                    )}>
                        {/* WhatsApp Button */}
                        <button
                            onClick={() => router.push('/whatsapp')}
                            className="p-2 relative hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors group"
                            title="Open WhatsApp"
                        >
                            <MessageCircle size={20} className="group-hover:text-[#25D366]" />
                        </button>

                        <button className="p-2 relative hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors">
                            <Bell size={20} />
                            <span className={cn(
                                "absolute top-2 w-2 h-2 bg-destructive rounded-full border-2 border-card",
                                isRTL ? "left-2" : "right-2"
                            )}></span>
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
}

