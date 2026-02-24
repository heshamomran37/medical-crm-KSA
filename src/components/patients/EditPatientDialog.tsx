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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className={cn(
                "bg-[#0a192f] w-full max-w-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar",
                isRTL && "text-right"
            )} dir={isRTL ? "rtl" : "ltr"}>
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-6 text-slate-500 hover:text-white transition-colors",
                        isRTL ? "left-6" : "right-6"
                    )}
                >
                    <X size={20} />
                </button>
                <h2 className="text-3xl font-serif italic text-white tracking-tight mb-8">
                    {t('edit_patient')}
                    <div className="h-px w-24 bg-gradient-to-r from-[#b78a5d]/50 to-transparent mt-2" />
                </h2>

                <form action={formAction} className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('full_name')} *</label>
                            <input
                                name="name"
                                defaultValue={patient.name}
                                required
                                className="w-full h-12 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#f59e0b]/50 placeholder:text-slate-600 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('patient_type')} *</label>
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('phone_number')}</label>
                            <input
                                name="phone"
                                defaultValue={patient.phone || ""}
                                type="tel"
                                dir="ltr"
                                className={cn(
                                    "w-full h-12 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#f59e0b]/50 outline-none",
                                    isRTL && "text-right"
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('whatsapp_number')}</label>
                            <input
                                name="whatsapp"
                                defaultValue={patient.whatsapp || ""}
                                type="tel"
                                dir="ltr"
                                className={cn(
                                    "w-full h-12 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#f59e0b]/50 outline-none",
                                    isRTL && "text-right"
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('email_address')}</label>
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
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#00a2ed] ml-1 font-mono">TELEGRAM</label>
                            <input name="telegram" defaultValue={patient.telegram || ""} dir="ltr" className={cn("w-full h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#00a2ed]/50 outline-none", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#ff3040] ml-1 font-mono">INSTAGRAM</label>
                            <input name="instagram" defaultValue={patient.instagram || ""} dir="ltr" className={cn("w-full h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#ff3040]/50 outline-none", isRTL && "text-right")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#fffc00] ml-1 font-mono">SNAPCHAT</label>
                            <input name="snapchat" defaultValue={patient.snapchat || ""} dir="ltr" className={cn("w-full h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#fffc00]/50 outline-none", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#1877f2] ml-1 font-mono">FACEBOOK</label>
                            <input name="facebook" defaultValue={patient.facebook || ""} dir="ltr" className={cn("w-full h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#1877f2]/50 outline-none", isRTL && "text-right")} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white ml-1 font-mono">TIKTOK</label>
                            <input name="tiktok" defaultValue={patient.tiktok || ""} dir="ltr" className={cn("w-full h-10 px-4 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-white/30 outline-none", isRTL && "text-right")} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('address')}</label>
                            <textarea
                                name="address"
                                defaultValue={patient.address || ""}
                                rows={1}
                                className="w-full px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#f59e0b]/50 min-h-[40px] outline-none"
                            />
                        </div>
                    </div>

                    {/* Medical Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('gender')}</label>
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('birth_date')}</label>
                            <input
                                name="birthDate"
                                defaultValue={patient.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : ""}
                                type="date"
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('status')}</label>
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
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f59e0b] ml-1">{t('activity')}</label>
                        <textarea
                            name="followUpStatus"
                            defaultValue={patient.followUpStatus || ""}
                            rows={2}
                            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#f59e0b]/50 outline-none resize-none"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 px-6 rounded-2xl border border-white/10 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="flex-1 h-12 px-6 rounded-2xl bg-[#b78a5d] text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#b78a5d]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#b78a5d]/20"
                        >
                            <Save size={14} />
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
