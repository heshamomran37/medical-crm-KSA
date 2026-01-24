"use client";

import { useActionState, useEffect } from "react";
import { updatePatient } from "@/lib/actions";
import { X, Save } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const initialState = {
    message: "",
};

interface Patient {
    id: string;
    name: string;
    type: string;
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    telegram: string | null;
    instagram: string | null;
    snapchat: string | null;
    facebook: string | null;
    tiktok: string | null;
    address: string | null;
    gender: string | null;
    birthDate: Date | null;
    status: string;
    followUpStatus: string | null;
}

interface EditPatientDialogProps {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
}

export function EditPatientDialog({ patient, isOpen, onClose }: EditPatientDialogProps) {
    const updatePatientWithId = updatePatient.bind(null, patient.id);
    const [state, formAction] = useActionState(updatePatientWithId, initialState);
    const { t, isRTL } = useLanguage();

    // Close on success
    useEffect(() => {
        if (state?.message === "Patient updated successfully!") {
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
                "bg-card w-full max-w-2xl p-6 rounded-xl border border-border shadow-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto",
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
                <h2 className="text-xl font-bold tracking-tight mb-4">{t('edit_patient')}: {patient.name}</h2>

                <form action={formAction} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('full_name')} *</label>
                            <input
                                name="name"
                                defaultValue={patient.name}
                                required
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('patient_type')} *</label>
                            <select
                                name="type"
                                defaultValue={patient.type}
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
                                defaultValue={patient.phone || ""}
                                type="tel"
                                dir="ltr"
                                className={cn(
                                    "w-full h-10 px-3 rounded-md border border-input bg-background",
                                    isRTL && "text-right"
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('whatsapp_number')}</label>
                            <input
                                name="whatsapp"
                                defaultValue={patient.whatsapp || ""}
                                type="tel"
                                dir="ltr"
                                className={cn(
                                    "w-full h-10 px-3 rounded-md border border-input bg-background",
                                    isRTL && "text-right"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('email_address')}</label>
                        <input
                            name="email"
                            defaultValue={patient.email || ""}
                            type="email"
                            dir="ltr"
                            className={cn(
                                "w-full h-10 px-3 rounded-md border border-input bg-background",
                                isRTL && "text-right"
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Telegram</label>
                            <input name="telegram" defaultValue={patient.telegram || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Instagram</label>
                            <input name="instagram" defaultValue={patient.instagram || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Snapchat</label>
                            <input name="snapchat" defaultValue={patient.snapchat || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Facebook</label>
                            <input name="facebook" defaultValue={patient.facebook || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">TikTok</label>
                            <input name="tiktok" defaultValue={patient.tiktok || ""} dir="ltr" className={cn("w-full h-10 px-3 rounded-md border border-input bg-background/50 text-foreground", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('address')}</label>
                            <textarea
                                name="address"
                                defaultValue={patient.address || ""}
                                rows={1}
                                className="w-full px-3 py-2 rounded-md border border-input bg-background/50 text-foreground min-h-[40px]"
                            />
                        </div>
                    </div>

                    {/* Medical Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{t('gender')}</label>
                            <select
                                name="gender"
                                defaultValue={patient.gender || ""}
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
                                defaultValue={patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : ""}
                                type="date"
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">{t('status')}</label>
                        <select
                            name="status"
                            defaultValue={patient.status}
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
                            defaultValue={patient.followUpStatus || ""}
                            rows={2}
                            className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-10 px-4 rounded-md border border-input hover:bg-secondary transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            {t('save_changes')}
                        </button>
                    </div>
                    {state?.message && (
                        <p className={cn(
                            "text-sm text-center",
                            state.message === "Patient updated successfully!" ? "text-green-600" : "text-red-600"
                        )}>
                            {state.message === "Patient updated successfully!" ? t('patient_updated_success') : state.message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
