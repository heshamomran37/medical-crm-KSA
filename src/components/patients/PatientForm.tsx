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
            className="h-12 px-8 rounded-2xl bg-[#b78a5d] text-white text-sm font-black uppercase tracking-widest hover:bg-[#b78a5d]/90 transition-all shadow-xl shadow-[#b78a5d]/10 w-full flex items-center justify-center gap-2 disabled:opacity-50"
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
        <form action={formAction} className="space-y-8 max-w-4xl mx-auto bg-[#0a192f]/90 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Decorative background glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#b78a5d]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#b78a5d]/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="space-y-2 relative z-10">
                <h3 className="text-3xl font-serif italic text-white flex items-center gap-3">
                    {t('add_new_patient')}
                    <div className="h-px w-24 bg-gradient-to-r from-[#b78a5d]/50 to-transparent" />
                </h3>
                <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-medium opacity-70">Create a New Clinical Profile</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 relative z-10">
                {/* Basic Info */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('full_name')} *</label>
                    <input
                        name="name"
                        required
                        className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold"
                        placeholder="e.g. Ahmed Mohamed"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('patient_type')} *</label>
                    <select
                        name="type"
                        required
                        className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold appearance-none [color-scheme:dark]"
                    >
                        <option value="Individual">{t('individual')}</option>
                        <option value="Company">{t('company')}</option>
                    </select>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('phone_number')}</label>
                    <input
                        name="phone"
                        type="tel"
                        dir="ltr"
                        defaultValue={initialPhone}
                        className={cn(
                            "w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold",
                            isRTL && "text-right"
                        )}
                        placeholder="+966 5x xxx xxxx"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('whatsapp_number')}</label>
                    <input
                        name="whatsapp"
                        type="tel"
                        dir="ltr"
                        defaultValue={initialWhatsApp || initialPhone}
                        className={cn(
                            "w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold",
                            isRTL && "text-right"
                        )}
                        placeholder="+966 5x xxx xxxx"
                    />
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('email_address')}</label>
                <input
                    name="email"
                    type="email"
                    dir="ltr"
                    className={cn(
                        "w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold",
                        isRTL && "text-right"
                    )}
                    placeholder="patient@medical.com"
                />
            </div>

            <div className="h-px bg-white/5 w-full relative z-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#00a2ed] px-1 font-mono">TELEGRAM</label>
                    <input name="telegram" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#00a2ed]/50 outline-none" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#ff3040] px-1 font-mono">INSTAGRAM</label>
                    <input name="instagram" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#ff3040]/50 outline-none" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#fffc00] px-1 font-mono">SNAPCHAT</label>
                    <input name="snapchat" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#fffc00]/50 outline-none" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#1877f2] px-1 font-mono">FACEBOOK</label>
                    <input name="facebook" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-[#1877f2]/50 outline-none" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white px-1 font-mono">TIKTOK</label>
                    <input name="tiktok" dir="ltr" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold focus:border-white/30 outline-none" placeholder="@username" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('gender')}</label>
                    <select name="gender" className="w-full h-12 px-5 rounded-xl border border-white/5 bg-white/5 text-white text-xs font-bold appearance-none [color-scheme:dark] outline-none focus:border-[#b78a5d]/50">
                        <option value="">{t('all_types')}</option>
                        <option value="Male">{t('male')}</option>
                        <option value="Female">{t('female')}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('birth_date')}</label>
                    <input name="birthDate" type="date" className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 outline-none font-bold [color-scheme:dark]" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('status')}</label>
                    <select name="status" className="w-full h-14 px-6 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 outline-none font-bold appearance-none [color-scheme:dark]">
                        <option value="New">{t('new')}</option>
                        <option value="Admitted">{t('admitted')}</option>
                        <option value="Under Treatment">{t('under_treatment')}</option>
                        <option value="Recovered">{t('recovered')}</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('address')}</label>
                <textarea name="address" rows={2} className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 outline-none font-bold resize-none" />
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] px-1">{t('activity')}</label>
                <textarea name="followUpStatus" rows={3} className="w-full px-6 py-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 outline-none font-bold resize-none" />
            </div>

            <div className="pt-6 relative z-10">
                <SubmitButton />
            </div>

            {state?.message && (
                <div className={cn(
                    "p-4 rounded-2xl text-center text-sm font-bold animate-in zoom-in-95 duration-300 shadow-sm border relative z-10",
                    state.message === "Patient added successfully!" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"
                )}>
                    {state.message === "Patient added successfully!" ? t('patient_added_success') : state.message}
                </div>
            )}
        </form>
    );
}
