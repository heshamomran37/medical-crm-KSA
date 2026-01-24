"use client";

import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createPatient } from "@/lib/actions";
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
            {pending ? t('adding') : t('add_patient')}
        </button>
    );
}

export function AddPatientDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(createPatient, initialState);
    const { t, isRTL } = useLanguage();

    // Close on success
    useEffect(() => {
        if (state?.message === "Patient added successfully!") {
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
                {t('add_patient')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={cn(
                        "bg-card w-full max-w-2xl p-6 rounded-xl border border-border shadow-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto",
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
                        <h2 className="text-xl font-bold tracking-tight mb-4">{t('add_patient')}</h2>

                        <form action={formAction} className="space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('full_name')} *</label>
                                    <input
                                        name="name"
                                        required
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                        placeholder="Ahmed Mohamed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('patient_type')} *</label>
                                    <select
                                        name="type"
                                        required
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    >
                                        <option value="Individual">{t('individual')}</option>
                                        <option value="Company">{t('company')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('phone_number')}</label>
                                    <input
                                        name="phone"
                                        type="tel"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="+20 123 456 7890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('whatsapp_number')}</label>
                                    <input
                                        name="whatsapp"
                                        type="tel"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="+20 123 456 7890"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('email_address')}</label>
                                <input
                                    name="email"
                                    type="email"
                                    dir="ltr"
                                    className={cn(
                                        "w-full h-10 px-3 rounded-md border border-input bg-background",
                                        isRTL && "text-right"
                                    )}
                                    placeholder="patient@example.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telegram</label>
                                    <input
                                        name="telegram"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="@username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instagram</label>
                                    <input
                                        name="instagram"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="@username"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Snapchat</label>
                                    <input
                                        name="snapchat"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="@username"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Facebook</label>
                                    <input
                                        name="facebook"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="@username"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">TikTok</label>
                                    <input
                                        name="tiktok"
                                        dir="ltr"
                                        className={cn(
                                            "w-full h-10 px-3 rounded-md border border-input bg-background",
                                            isRTL && "text-right"
                                        )}
                                        placeholder="@username"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('address')}</label>
                                    <textarea
                                        name="address"
                                        rows={1}
                                        className="w-full px-3 py-2 rounded-md border border-input bg-background h-10"
                                    />
                                </div>
                            </div>

                            {/* Medical Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('gender')}</label>
                                    <select
                                        name="gender"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    >
                                        <option value="">{t('all_types')}</option>
                                        <option value="Male">{t('male')}</option>
                                        <option value="Female">{t('female')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">{t('birth_date')}</label>
                                    <input
                                        name="birthDate"
                                        type="date"
                                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('status')}</label>
                                <select
                                    name="status"
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                >
                                    <option value="New">{t('new')}</option>
                                    <option value="Admitted">{t('admitted')}</option>
                                    <option value="Under Treatment">{t('under_treatment')}</option>
                                    <option value="Recovered">{t('recovered')}</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">{t('activity')}</label>
                                <textarea
                                    name="followUpStatus"
                                    rows={2}
                                    className="w-full px-3 py-2 rounded-md border border-input bg-background"
                                />
                            </div>

                            <div className="pt-2">
                                <SubmitButton />
                            </div>
                            {state?.message && (
                                <p className={cn(
                                    "text-sm text-center",
                                    state.message === "Patient added successfully!" ? "text-green-600" : "text-red-600"
                                )}>
                                    {state.message === "Patient added successfully!" ? t('patient_added_success') : state.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
