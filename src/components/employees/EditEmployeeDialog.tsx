"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateEmployee } from "@/lib/actions";
import { X, Save } from "lucide-react";
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "bg-card w-full max-w-md p-6 rounded-xl border border-border shadow-lg relative animate-in zoom-in-95 duration-200 lg:max-w-lg max-h-[90vh] overflow-y-auto",
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
                <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">{t('edit_employee')}</h2>

                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('full_name')}</label>
                        <input name="name" defaultValue={employee.name} required className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('role')}</label>
                        <input name="role" defaultValue={employee.role} required className="w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('email_address')}</label>
                            <input name="email" defaultValue={employee.email || ""} type="email" dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('phone_number')}</label>
                            <input name="phone" defaultValue={employee.phone || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('whatsapp_number')}</label>
                            <input name="whatsapp" defaultValue={employee.whatsapp || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Telegram</label>
                            <input name="telegram" defaultValue={employee.telegram || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Instagram</label>
                            <input name="instagram" defaultValue={employee.instagram || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Snapchat</label>
                            <input name="snapchat" defaultValue={employee.snapchat || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('address')}</label>
                        <textarea name="address" defaultValue={employee.address || ""} rows={1} className="w-full px-3 py-2 rounded-md border border-input bg-background/50 text-foreground min-h-[40px]" />
                    </div>

                    <div className="border-t border-border pt-4 mt-2">
                        <h3 className="text-sm font-semibold mb-3 text-foreground">{t('login_credentials')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">{t('username')}</label>
                                <input name="username" defaultValue={employee.username || ""} required dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">{t('password')}</label>
                                <input name="password" type="password" minLength={3} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} placeholder={t('save_changes')} />
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
