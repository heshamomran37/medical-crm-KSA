"use client";

import { Globe, Clock, Bell, Shield, Database, Palette, Check } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function SettingsPageClient() {
    const { theme, setTheme } = useTheme();
    const { t, language, setLanguage, isRTL } = useLanguage();

    return (
        <div className={cn("max-w-4xl mx-auto space-y-8 animate-fade-up", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#0a192f] font-serif italic">{t('settings_title')}</h1>
                <p className="text-muted-foreground mt-1">{t('settings_subtitle')}</p>
            </div>

            {/* Language & Localization */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Globe className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('lang_localization')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('lang_localization_desc')}</p>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('system_lang')}</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-[#b78a5d]/20"
                        >
                            <option value="en">🇬🇧 English (US)</option>
                            <option value="ar">🇪🇬 Arabic (العربية)</option>
                        </select>
                        <p className="text-xs text-muted-foreground">{t('choose_pref_lang')}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('date_format')}</label>
                        <select dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-[#b78a5d]/20", isRTL && "text-right")}>
                            <option value="mdy">{t('date_format_us')}</option>
                            <option value="dmy">{t('date_format_eg')}</option>
                            <option value="ymd">{t('date_format_iso')}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Time & Date Zone */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Clock className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('time_date_settings')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('time_date_desc')}</p>
                </div>
                <div className="p-6 grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('timezone')}</label>
                        <select dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-[#b78a5d]/20", isRTL && "text-right")}>
                            <option value="africa/cairo">{t('cairo_tz')}</option>
                            <option value="utc">{t('utc_tz')}</option>
                            <option value="america/new_york">{t('ny_tz')}</option>
                            <option value="europe/london">{t('london_tz')}</option>
                            <option value="asia/dubai">{t('dubai_tz')}</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('clock_display')}</label>
                        <div className={cn("flex gap-4 pt-2", isRTL && "flex-row-reverse")}>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="clock" defaultChecked className="text-[#b78a5d] focus:ring-[#b78a5d]" />
                                <span className="text-sm">{t('12_hour')}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="clock" className="text-[#b78a5d] focus:ring-[#b78a5d]" />
                                <span className="text-sm">{t('24_hour')}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Bell className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('notifications')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('notifications_desc')}</p>
                </div>
                <div className="p-6 space-y-4">
                    <label className={cn("flex items-center justify-between cursor-pointer", isRTL && "flex-row-reverse")}>
                        <div>
                            <div className="font-medium">{t('whatsapp_notif')}</div>
                            <div className="text-sm text-muted-foreground">{t('whatsapp_notif_desc')}</div>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle accent-[#b78a5d]" />
                    </label>
                    <label className={cn("flex items-center justify-between cursor-pointer", isRTL && "flex-row-reverse")}>
                        <div>
                            <div className="font-medium">{t('email_notif')}</div>
                            <div className="text-sm text-muted-foreground">{t('email_notif_desc')}</div>
                        </div>
                        <input type="checkbox" defaultChecked className="toggle accent-[#b78a5d]" />
                    </label>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Palette className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('appearance')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('appearance_desc')}</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <label className="text-sm font-bold uppercase tracking-widest text-slate-500">{t('theme_mode')}</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme("light")}
                                className={cn(
                                    "relative h-24 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
                                    theme === "light"
                                        ? "border-[#b78a5d] bg-[#b78a5d]/5 shadow-md shadow-[#b78a5d]/10"
                                        : "border-slate-100 bg-white hover:border-slate-200"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-white shadow-sm border border-slate-100"></div>
                                </div>
                                <span className={cn("text-xs font-bold uppercase tracking-tighter", theme === "light" ? "text-[#b78a5d]" : "text-slate-500")}>
                                    {t('light_mode')}
                                </span>
                                {theme === "light" && (
                                    <div className={cn(
                                        "absolute top-2 w-5 h-5 rounded-full bg-[#b78a5d] flex items-center justify-center text-white",
                                        isRTL ? "left-2" : "right-2"
                                    )}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => setTheme("dark")}
                                className={cn(
                                    "relative h-24 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
                                    theme === "dark"
                                        ? "border-[#b78a5d] bg-[#b78a5d]/5 shadow-md shadow-[#b78a5d]/10"
                                        : "border-slate-800 bg-[#0a192f] hover:border-slate-700"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-[#0a192f] shadow-sm border border-slate-700"></div>
                                </div>
                                <span className={cn("text-xs font-bold uppercase tracking-tighter", theme === "dark" ? "text-white" : "text-slate-400")}>
                                    {t('dark_mode')}
                                </span>
                                {theme === "dark" && (
                                    <div className={cn(
                                        "absolute top-2 w-5 h-5 rounded-full bg-[#b78a5d] flex items-center justify-center text-white",
                                        isRTL ? "left-2" : "right-2"
                                    )}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}
                            </button>

                            <button
                                onClick={() => setTheme("system")}
                                className={cn(
                                    "relative h-24 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 group",
                                    theme === "system"
                                        ? "border-[#b78a5d] bg-[#b78a5d]/5 shadow-md shadow-[#b78a5d]/10"
                                        : "border-slate-100 bg-gradient-to-br from-white to-slate-100 hover:border-slate-200"
                                )}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                    <div className="flex w-full h-full">
                                        <div className="w-1/2 h-full bg-white"></div>
                                        <div className="w-1/2 h-full bg-[#0a192f]"></div>
                                    </div>
                                </div>
                                <span className={cn("text-xs font-bold uppercase tracking-tighter", theme === "system" ? "text-[#b78a5d]" : "text-slate-500")}>
                                    {t('system_auto')}
                                </span>
                                {theme === "system" && (
                                    <div className={cn(
                                        "absolute top-2 w-5 h-5 rounded-full bg-[#b78a5d] flex items-center justify-center text-white",
                                        isRTL ? "left-2" : "right-2"
                                    )}>
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Shield className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('security_privacy')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('security_privacy_desc')}</p>
                </div>
                <div className="p-6 space-y-4">
                    <button className={cn("w-full h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium", isRTL ? "text-right" : "text-left")}>
                        {t('change_password')}
                    </button>
                    <button className={cn("w-full h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium", isRTL ? "text-right" : "text-left")}>
                        {t('two_factor')}
                    </button>
                    <button className={cn("w-full h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium", isRTL ? "text-right" : "text-left")}>
                        {t('active_sessions')}
                    </button>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/30">
                    <div className={cn("flex items-center gap-3 mb-2", isRTL && "flex-row-reverse")}>
                        <div className="p-2 rounded-lg bg-[#b78a5d]/10">
                            <Database className="text-[#b78a5d]" size={20} />
                        </div>
                        <h2 className="text-lg font-semibold">{t('data_mgmt')}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{t('data_mgmt_desc')}</p>
                </div>
                <div className="p-6 space-y-4">
                    <button className="w-full h-10 px-4 rounded-md bg-[#0a192f] text-white hover:bg-[#112240] transition-colors text-sm font-medium">
                        {t('export_excel')}
                    </button>
                    <button className="w-full h-10 px-4 rounded-md border border-border hover:bg-secondary transition-colors text-sm font-medium">
                        {t('import_data')}
                    </button>
                    <button className="w-full h-10 px-4 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
                        {t('clear_data')}
                    </button>
                </div>
            </div>

            <div className={cn("flex justify-end gap-2 pt-4", isRTL && "flex-row-reverse")}>
                <button className="h-10 px-6 rounded-md border border-input bg-background hover:bg-secondary transition-colors">
                    {t('cancel')}
                </button>
                <button className="h-10 px-6 rounded-md bg-[#0a192f] text-white hover:bg-[#112240] transition-colors shadow-sm">
                    {t('save_changes')}
                </button>
            </div>
        </div>
    );
}
