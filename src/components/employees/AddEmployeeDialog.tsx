"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createEmployee } from "@/lib/actions";
import { UserPlus, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

import { useEffect } from "react";

const initialState = {
    message: "",
};

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useLanguage();
    return (
        <button
            type="submit"
            disabled={pending}
            className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm w-full flex items-center justify-center gap-2"
        >
            {pending ? t('adding') : t('add_employee')}
        </button>
    );
}

export function AddEmployeeDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(createEmployee, initialState);
    const { t, isRTL } = useLanguage();

    // Close on success
    useEffect(() => {
        if (state?.message === "Employee added successfully!") {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-2"
            >
                <UserPlus size={16} />
                {t('add_employee')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className={cn(
                        "bg-[#0a192f] w-full max-w-md p-8 rounded-[2rem] border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto",
                        isRTL && "text-right"
                    )} dir={isRTL ? "rtl" : "ltr"}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "absolute top-4 text-muted-foreground hover:text-foreground",
                                isRTL ? "left-4" : "right-4"
                            )}
                        >
                            <X size={20} />
                        </button>
                        <h2 className="text-2xl font-serif italic text-white mb-6 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
                                <UserPlus size={20} />
                            </div>
                            {t('add_employee')}
                        </h2>

                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('full_name')}</label>
                                <input name="name" required className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]" placeholder="Dr. John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('role')}</label>
                                <input name="role" required className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]" placeholder="Cardiologist" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('email_address')}</label>
                                    <input name="email" type="email" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="john@med.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('phone_number')}</label>
                                    <input name="phone" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="+1..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('whatsapp_number')}</label>
                                    <input name="whatsapp" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="+20..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Telegram</label>
                                    <input name="telegram" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="@username" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Instagram</label>
                                    <input name="instagram" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="@username" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Snapchat</label>
                                    <input name="snapchat" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="@username" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('address')}</label>
                                <textarea name="address" rows={2} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]" />
                            </div>

                            <div className="border-t border-white/10 pt-6 mt-4">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">{t('login_credentials')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('username')}</label>
                                        <input name="username" required dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="john.doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('password')}</label>
                                        <input name="password" required minLength={3} type="password" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all placeholder:text-slate-600 [color-scheme:dark]", isRTL && "text-right")} placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                            {state?.message && <p className="text-sm text-center text-muted-foreground">{state.message}</p>}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
