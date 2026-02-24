"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateEmployee } from "@/lib/actions";
import { X, Save, Edit } from "lucide-react";
import { Employee } from "@prisma/client";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

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
            {pending ? (
                t('saving')
            ) : (
                <>
                    <Save size={16} />
                    {t('save_changes')}
                </>
            )}
        </button>
    );
}

interface EditEmployeeDialogProps {
    employee: Employee;
    isOpen: boolean;
    onClose: () => void;
}

export function EditEmployeeDialog({ employee, isOpen, onClose }: EditEmployeeDialogProps) {
    const updateAction = updateEmployee.bind(null, employee.id);
    const [state, formAction] = useActionState(updateAction, initialState);
    const { t, isRTL } = useLanguage();

    // Close on success
    useEffect(() => {
        if (state?.message === "Employee updated successfully!") {
            const timer = setTimeout(() => {
                onClose();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className={cn(
                "bg-[#0a192f] w-full max-w-md p-8 rounded-[2rem] border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 lg:max-w-lg max-h-[90vh] overflow-y-auto",
                isRTL && "text-right"
            )} dir={isRTL ? "rtl" : "ltr"}>
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-4 text-muted-foreground hover:text-foreground",
                        isRTL ? "left-4" : "right-4"
                    )}
                >
                    <X size={20} />
                </button>
                <h2 className="text-2xl font-serif italic text-white mb-6 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b]">
                        <Edit size={20} />
                    </div>
                    {t('edit_employee')}
                </h2>

                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('full_name')}</label>
                        <input name="name" defaultValue={employee.name} required className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('role')}</label>
                        <input name="role" defaultValue={employee.role} required className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('email_address')}</label>
                            <input name="email" defaultValue={employee.email || ""} type="email" dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('phone_number')}</label>
                            <input name="phone" defaultValue={employee.phone || ""} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('whatsapp_number')}</label>
                            <input name="whatsapp" defaultValue={employee.whatsapp || ""} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Telegram</label>
                            <input name="telegram" defaultValue={employee.telegram || ""} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Instagram</label>
                            <input name="instagram" defaultValue={employee.instagram || ""} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">Snapchat</label>
                            <input name="snapchat" defaultValue={employee.snapchat || ""} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('address')}</label>
                        <textarea name="address" defaultValue={employee.address || ""} rows={1} className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all min-h-[50px] [color-scheme:dark]" />
                    </div>

                    <div className="border-t border-white/10 pt-6 mt-4">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">{t('login_credentials')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('username')}</label>
                                <input name="username" defaultValue={employee.username || ""} required dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-[#f59e0b] px-1">{t('password')}</label>
                                <input name="password" type="password" minLength={3} dir="ltr" className={cn("w-full h-12 px-4 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/20 transition-all [color-scheme:dark]", isRTL && "text-right")} placeholder={t('save_changes')} />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                    {state?.message && (
                        <p className={cn(
                            "text-sm text-center",
                            state.message.includes("success") ? "text-green-500" : "text-red-500"
                        )}>
                            {state.message === "Employee updated successfully!" ? t('employee_updated_success') : state.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
