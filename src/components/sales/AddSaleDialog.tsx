"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createSale } from "@/lib/actions";
import { Plus, X, Search, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const initialState = { message: "" };

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

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone?.includes(searchQuery)
    ).slice(0, 5);

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
                className="h-10 px-4 rounded-xl bg-[#b78a5d] text-white text-sm font-bold hover:bg-[#b78a5d]/90 transition-all shadow-lg shadow-[#b78a5d]/20 flex items-center gap-2"
            >
                <Plus size={16} />
                {t('add_sale')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={cn(
                        "bg-[#0a192f] w-full max-w-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto",
                        isRTL && "text-right"
                    )} dir={isRTL ? "rtl" : "ltr"}>
                        <button
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "absolute top-6 text-slate-500 hover:text-white transition-colors",
                                isRTL ? "left-6" : "right-6"
                            )}
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-serif italic text-white mb-6 uppercase tracking-tight">{t('add_sale')}</h2>

                        <form action={formAction} className="space-y-6">
                            {/* Patient Selection */}
                            <div className="space-y-2 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('select_patient')}</label>
                                <div className="relative">
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
                                        className="w-full h-12 px-10 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                    <Search className={cn("absolute top-3.5 text-slate-500", isRTL ? "right-3" : "left-3")} size={18} />
                                    {selectedPatient && (
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedPatient(null); setSearchQuery(""); }}
                                            className={cn("absolute top-3.5 text-slate-500 hover:text-white", isRTL ? "left-3" : "right-3")}
                                        >
                                            <X size={18} />
                                        </button>
                                    )}
                                </div>

                                {showPatientList && searchQuery && !selectedPatient && (
                                    <div className="absolute z-10 w-full mt-2 bg-[#0d213f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                                        {filteredPatients.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedPatient(p);
                                                    setShowPatientList(false);
                                                }}
                                                className="w-full p-4 hover:bg-white/5 flex items-center justify-between text-left transition-colors border-b border-white/5 last:border-0"
                                            >
                                                <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse text-right")}>
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                        <User size={14} className="text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-white text-sm font-bold">{p.name}</p>
                                                        <p className="text-slate-500 text-[10px]">{p.phone}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-[#b78a5d] font-bold uppercase tracking-tighter">{t(p.gender?.toLowerCase() || 'male')}</span>
                                            </button>
                                        ))}
                                        {filteredPatients.length === 0 && (
                                            <div className="p-4 text-center text-slate-500 text-xs">{t('no_results')}</div>
                                        )}
                                    </div>
                                )}
                                <input type="hidden" name="patientId" value={selectedPatient?.id || ""} required />
                                <input type="hidden" name="gender" value={selectedPatient?.gender || "Male"} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('cups_count')}</label>
                                    <input
                                        name="cupsCount"
                                        type="number"
                                        defaultValue={0}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('total_amount')}</label>
                                    <input
                                        name="totalAmount"
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('cash_amount')}</label>
                                    <input
                                        name="cashAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={0}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('network_amount')}</label>
                                    <input
                                        name="networkAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={0}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('disease_complaint')}</label>
                                <input
                                    name="disease"
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    placeholder="Ex: Back pain"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('offers_discounts')}</label>
                                    <input
                                        name="offers"
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('notes')}</label>
                                    <input
                                        name="notes"
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <SubmitButton />
                            </div>

                            {state?.message && (
                                <p className={cn(
                                    "text-sm text-center font-bold animate-in fade-in duration-300",
                                    state.message === "Sale recorded successfully!" ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {state.message === "Sale recorded successfully!" ? t('sale_recorded_success') : state.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
