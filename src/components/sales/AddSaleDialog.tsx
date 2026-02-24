"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createSale } from "@/lib/actions";
import { Plus, X, Search, User, Calendar } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const initialState = { message: "" };

function getCurrentDateTimeLocal() {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useLanguage();
    return (
        <button
            type="submit"
            disabled={pending}
            className="h-10 px-4 rounded-xl bg-[#b78a5d] text-white text-sm font-bold hover:bg-[#b78a5d]/90 transition-all shadow-lg shadow-[#b78a5d]/20 w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? t('recording') : t('add_sale')}
        </button>
    );
}

export function AddSaleDialog({ patients }: { patients: any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(createSale, initialState);
    const { t, isRTL } = useLanguage();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showPatientList, setShowPatientList] = useState(false);
    const [saleDateTime, setSaleDateTime] = useState(getCurrentDateTimeLocal());
    const [isTesting, setIsTesting] = useState(false);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
    ).slice(0, 5);

    useEffect(() => {
        if (isOpen) {
            setSaleDateTime(getCurrentDateTimeLocal());
        }
    }, [isOpen]);

    useEffect(() => {
        if (state?.message === "Sale recorded successfully!") {
            const timer = setTimeout(() => {
                setIsOpen(false);
                setSelectedPatient(null);
                setSearchQuery("");
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="group relative h-10 px-6 rounded-xl bg-gradient-to-r from-[#b78a5d] to-[#8c6a46] text-white text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_8px_32px_rgba(183,138,93,0.3)] flex items-center gap-2"
            >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Plus size={16} className="relative z-10" />
                <span className="relative z-10">{t('add_sale')}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#020817]/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setIsOpen(false)} />

                    <div className={cn(
                        "bg-[#0a192f]/90 w-full max-w-xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar",
                        isRTL && "text-right"
                    )} dir={isRTL ? "rtl" : "ltr"}>

                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#b78a5d]/10 blur-[100px] rounded-full pointer-events-none" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#b78a5d]/5 blur-[100px] rounded-full pointer-events-none" />

                        <button
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "absolute top-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all",
                                isRTL ? "left-6" : "right-6"
                            )}
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-3xl font-serif italic text-white tracking-tight flex items-center gap-3">
                                {t('add_sale')}
                                <div className="h-px flex-1 bg-gradient-to-r from-[#b78a5d]/50 to-transparent ml-4" />
                            </h2>
                            <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em] font-medium opacity-70">New Transaction Entry</p>
                        </div>

                        <form action={formAction} className="space-y-6">
                            {/* Patient Selection */}
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1 flex items-center gap-2">
                                    <User size={10} />
                                    {t('select_patient')}
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#b78a5d]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity blur-xl pointer-events-none" />
                                    <input
                                        type="text"
                                        value={selectedPatient ? selectedPatient.name : searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            if (selectedPatient) setSelectedPatient(null);
                                            setShowPatientList(true);
                                        }}
                                        onFocus={() => setShowPatientList(true)}
                                        placeholder={t('search_patients')}
                                        className="relative w-full h-14 px-12 rounded-2xl border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                    <Search className={cn("absolute top-4.5 text-slate-500", isRTL ? "right-4" : "left-4")} size={18} />
                                    {selectedPatient && (
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedPatient(null); setSearchQuery(""); }}
                                            className={cn("absolute top-4 p-1 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-all", isRTL ? "left-4" : "right-4")}
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>

                                {showPatientList && searchQuery && !selectedPatient && (
                                    <div className="absolute z-20 w-full mt-2 bg-[#0d213f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in slide-in-from-top-2 duration-300">
                                        {filteredPatients.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPatient(p);
                                                    setShowPatientList(false);
                                                }}
                                                className="w-full p-4 hover:bg-[#b78a5d]/10 flex items-center justify-between text-left transition-all border-b border-white/5 last:border-0 group"
                                            >
                                                <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse text-right")}>
                                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-[#b78a5d]/30 transition-all">
                                                        <User size={16} className="text-slate-400 group-hover:text-[#b78a5d]" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold group-hover:text-[#b78a5d] transition-colors">{p.name}</p>
                                                        <p className="text-slate-500 text-[10px] tracking-wider">{p.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] text-[#b78a5d] font-bold uppercase tracking-tighter bg-[#b78a5d]/5 px-2 py-0.5 rounded-full border border-[#b78a5d]/10">{t(p.gender?.toLowerCase() || 'male')}</span>
                                                </div>
                                            </button>
                                        ))}
                                        {filteredPatients.length === 0 && (
                                            <div className="p-8 text-center bg-black/20">
                                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                                                    <Search size={20} className="text-slate-600" />
                                                </div>
                                                <p className="text-slate-500 text-xs italic">{t('no_results')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <input type="hidden" name="patientId" value={selectedPatient?.id || ""} required />
                                <input type="hidden" name="gender" value={selectedPatient?.gender || "Male"} />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('cups_count')}</label>
                                    <input
                                        name="cupsCount"
                                        type="number"
                                        defaultValue={0}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('total_amount')}</label>
                                    <div className="relative">
                                        <input
                                            name="totalAmount"
                                            type="number"
                                            step="0.01"
                                            required
                                            className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none font-bold"
                                        />
                                        <span className="absolute right-5 top-4.5 text-[10px] text-slate-500 font-bold uppercase">SAR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('cash_amount')}</label>
                                    <input
                                        name="cashAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={0}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('network_amount')}</label>
                                    <input
                                        name="networkAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={0}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('disease_complaint')}</label>
                                <input
                                    name="disease"
                                    className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    placeholder="Ex: Lower back pain therapy"
                                />
                            </div>

                            {/* Date / Time / Day */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1 flex items-center gap-2">
                                    <Calendar size={10} />
                                    {t('date_time') || "Date & Time"}
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={saleDateTime}
                                        onChange={(e) => setSaleDateTime(e.target.value)}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 outline-none [color-scheme:dark] transition-all"
                                    />
                                    <input type="hidden" name="saleDate" value={saleDateTime} />
                                </div>
                                {saleDateTime && (
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="w-1 h-1 rounded-full bg-[#b78a5d]" />
                                        <p className="text-[10px] text-slate-400 font-medium">
                                            {new Date(saleDateTime).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('offers_discounts')}</label>
                                    <input
                                        name="offers"
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('notes')}</label>
                                    <input
                                        name="notes"
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex flex-col gap-4">
                                <SubmitButton />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsTesting(true);
                                        setTimeout(() => setIsTesting(false), 2000);
                                    }}
                                    className="text-[10px] text-slate-600 hover:text-slate-400 uppercase tracking-widest transition-colors font-bold"
                                >
                                    {isTesting ? "Connection verified ✓" : "Verify Database Connection"}
                                </button>
                            </div>

                            {state?.message && (
                                <div className={cn(
                                    "p-4 rounded-xl text-sm text-center font-bold animate-in zoom-in-95 duration-300",
                                    state.message === "Sale recorded successfully!" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}>
                                    {state.message === "Sale recorded successfully!" ? t('sale_recorded_success') : state.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
