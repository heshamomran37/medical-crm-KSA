"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { updateSale, deleteSale } from "@/lib/actions";
import { Pencil, X, Search, User, Calendar, Trash2 } from "lucide-react";
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
            {pending ? t('updating') : t('update_sale')}
        </button>
    );
}

export function EditSaleDialog({ sale }: { sale: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const updateSaleWithId = updateSale.bind(null, sale.id);
    const [state, formAction] = useActionState(updateSaleWithId, initialState);
    const { t, isRTL } = useLanguage();

    const [saleDateTime, setSaleDateTime] = useState("");

    useEffect(() => {
        if (isOpen) {
            const date = new Date(sale.saleDate || sale.createdAt);
            const pad = (n: number) => String(n).padStart(2, "0");
            const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
            setSaleDateTime(formatted);
        }
    }, [isOpen, sale]);

    useEffect(() => {
        if (state?.message === "Sale updated successfully!") {
            const timer = setTimeout(() => {
                setIsOpen(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [state]);

    const handleDelete = async () => {
        if (confirm(t('confirm_delete_sale') || "Are you sure you want to delete this sale?")) {
            await deleteSale(sale.id);
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-2.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-[#b78a5d] transition-all active:scale-95 border border-white/5 hover:border-[#b78a5d]/30"
                title={t('edit')}
            >
                <Pencil size={16} />
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

                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-3xl font-serif italic text-white tracking-tight flex items-center gap-3">
                                    {t('edit_sale')}
                                    <div className="h-px w-24 bg-gradient-to-r from-[#b78a5d]/50 to-transparent" />
                                </h2>
                                <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.2em] font-medium opacity-70">Update Transaction Details</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleDelete}
                                    type="button"
                                    className="p-3 text-red-400 hover:bg-red-400/10 rounded-2xl transition-all border border-red-400/10 hover:border-red-400/20"
                                    title={t('delete')}
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <form action={formAction} className="space-y-6">
                            <input type="hidden" name="patientId" value={sale.patientId} />
                            <input type="hidden" name="gender" value={sale.gender || ""} />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1 flex items-center gap-2">
                                    <User size={10} />
                                    {t('patient_name')}
                                </label>
                                <div className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-slate-400 flex items-center font-bold">
                                    {sale.patient.name}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('cups_count')}</label>
                                    <input
                                        name="cupsCount"
                                        type="number"
                                        defaultValue={sale.cupsCount}
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
                                            defaultValue={sale.totalAmount}
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
                                        defaultValue={sale.cashAmount}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('network_amount')}</label>
                                    <input
                                        name="networkAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={sale.networkAmount}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('disease_complaint')}</label>
                                <input
                                    name="disease"
                                    defaultValue={sale.disease || ""}
                                    className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                />
                            </div>

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
                                        defaultValue={sale.offers || ""}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b78a5d] ml-1">{t('notes')}</label>
                                    <input
                                        name="notes"
                                        defaultValue={sale.notes || ""}
                                        className="w-full h-14 px-5 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 focus:bg-white/10 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <SubmitButton />
                            </div>

                            {state?.message && (
                                <div className={cn(
                                    "p-4 rounded-xl text-sm text-center font-bold animate-in zoom-in-95 duration-300",
                                    state.message === "Sale updated successfully!" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                )}>
                                    {state.message === "Sale updated successfully!" ? t('sale_updated_success') : state.message}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
