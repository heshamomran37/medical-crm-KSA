"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createPatient } from "@/lib/actions";
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
            className="h-12 px-8 rounded-2xl bg-[#0a192f] text-white text-sm font-black uppercase tracking-widest hover:bg-[#112240] transition-all shadow-xl shadow-[#0a192f]/10 w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? t('adding') : t('add_patient')}
        </button>
    );
}

interface PatientFormProps {
    onSuccess?: () => void;
    onComplete?: (patient: { name: string; phone: string }) => void;
    initialPhone?: string;
    initialWhatsApp?: string;
}

export function PatientForm({ onSuccess, onComplete, initialPhone, initialWhatsApp }: PatientFormProps) {
    const [state, formAction] = useActionState(createPatient, initialState);
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        if (state?.message === "Patient added successfully!") {
            // Success logic
            if (onSuccess) onSuccess();
            // If we have form data, we can try to extract it, but for now we rely on the action returning data 
            // Since our action currently only returns a message, we might need to adjust or just refresh list
            if (onComplete) {
                // We'll pass back the phone so the WASender can match it
                onComplete({ name: "", phone: initialPhone || initialWhatsApp || "" });
            }
        }
    }, [state, onSuccess, onComplete, initialPhone, initialWhatsApp]);

    return (
        <form action={formAction} className="space-y-8 max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="space-y-1">
                <h3 className="text-2xl font-serif italic text-[#0a192f]">{t('add_new_patient')}</h3>
                <p className="text-slate-400 text-sm font-medium">Please provide the complete patient profile details below.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Basic Info */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('full_name')} *</label>
                    <input
                        name="name"
                        required
                        className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d] outline-none transition-all font-bold text-slate-700"
                        placeholder="e.g. Ahmed Mohamed"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('patient_type')} *</label>
                    <select
                        name="type"
                        required
                        className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d] outline-none transition-all font-bold text-slate-700 appearance-none"
                    >
                        <option value="Individual">{t('individual')}</option>
                        <option value="Company">{t('company')}</option>
                    </select>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('phone_number')}</label>
                    <input
                        name="phone"
                        type="tel"
                        dir="ltr"
                        defaultValue={initialPhone}
                        className={cn(
                            "w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d] outline-none transition-all font-bold text-slate-700",
                            isRTL && "text-right"
                        )}
                        placeholder="+20 123 456 7890"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('whatsapp_number')}</label>
                    <input
                        name="whatsapp"
                        type="tel"
                        dir="ltr"
                        defaultValue={initialWhatsApp || initialPhone}
                        className={cn(
                            "w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d] outline-none transition-all font-bold text-slate-700",
                            isRTL && "text-right"
                        )}
                        placeholder="+20 123 456 7890"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('email_address')}</label>
                <input
                    name="email"
                    type="email"
                    dir="ltr"
                    className={cn(
                        "w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-[#b78a5d]/10 focus:border-[#b78a5d] outline-none transition-all font-bold text-slate-700",
                        isRTL && "text-right"
                    )}
                    placeholder="patient@medical.com"
                />
            </div>

            <div className="divider h-px bg-slate-50 w-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#0088cc] px-1">Telegram</label>
                    <input name="telegram" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#e1306c] px-1">Instagram</label>
                    <input name="instagram" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#fffc00] px-1">Snapchat</label>
                    <input name="snapchat" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1877f2] px-1">Facebook</label>
                    <input name="facebook" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#000000] px-1">TikTok</label>
                    <input name="tiktok" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('gender')}</label>
                    <select name="gender" className="w-full h-12 px-5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-bold appearance-none">
                        <option value="">{t('all_types')}</option>
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('birth_date')}</label>
                    <input name="birthDate" type="date" className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-bold text-slate-700" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('status')}</label>
                    <select name="status" className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-bold text-slate-700 appearance-none">
                        <option value="New">{t('new')}</option>
                        <option value="Admitted">{t('admitted')}</option>
                        <option value="Under Treatment">{t('under_treatment')}</option>
                        <option value="Recovered">{t('recovered')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('address')}</label>
                <textarea name="address" rows={2} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-bold text-slate-700 resize-none" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">{t('activity')}</label>
                <textarea name="followUpStatus" rows={3} className="w-full px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-bold text-slate-700 resize-none" />
            </div>

            <div className="pt-6">
                <SubmitButton />
            </div>

            {state?.message && (
                <div className={cn(
                    "p-4 rounded-2xl text-center text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm border",
                    state.message === "Patient added successfully!" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                )}>
                    {state.message === "Patient added successfully!" ? t('patient_added_success') : state.message}
                </div>
            )}
        </form>
    );
}
