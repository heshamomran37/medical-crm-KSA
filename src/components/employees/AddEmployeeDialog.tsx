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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={cn(
                        "bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto",
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
                        <h2 className="text-xl font-bold tracking-tight mb-4">{t('add_employee')}</h2>

                        <form action={formAction} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('full_name')}</label>
                                <input name="name" required className="w-full h-10 px-3 rounded-md border border-input bg-background" placeholder="Dr. John Doe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('role')}</label>
                                <input name="role" required className="w-full h-10 px-3 rounded-md border border-input bg-background" placeholder="Cardiologist" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('email_address')}</label>
                                    <input name="email" type="email" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="john@med.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('phone_number')}</label>
                                    <input name="phone" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="+1..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('whatsapp_number')}</label>
                                    <input name="whatsapp" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="+20..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telegram</label>
                                    <input name="telegram" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="@username" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instagram</label>
                                    <input name="instagram" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="@username" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Snapchat</label>
                                    <input name="snapchat" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="@username" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('address')}</label>
                                <textarea name="address" rows={2} className="w-full px-3 py-2 rounded-md border border-input bg-background" />
                            </div>

                            <div className="border-t border-border pt-4 mt-2">
                                <h3 className="text-sm font-semibold mb-3">{t('login_credentials')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('username')}</label>
                                        <input name="username" required dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="john.doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('password')}</label>
                                        <input name="password" required minLength={3} type="password" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background", isRTL && "text-right")} placeholder="••••••••" />
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
