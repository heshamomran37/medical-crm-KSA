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
            {pending ? t('updating') || "Updating..." : t('update_sale') || "Update Sale"}
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
                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-[#b78a5d] transition-all"
                title={t('edit')}
            >
                <Pencil size={16} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 text-left" dir={isRTL ? "rtl" : "ltr"}>
                    <div className={cn(
                        "bg-[#0a192f] w-full max-w-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto",
                        isRTL && "text-right"
                    )}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif italic text-white uppercase tracking-tight">{t('edit_sale') || "Edit Sale"}</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDelete}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                    title={t('delete')}
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-500 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('patient_name')}</label>
                                <div className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-slate-400 flex items-center">
                                    {sale.patient.name}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('cups_count')}</label>
                                    <input
                                        name="cupsCount"
                                        type="number"
                                        defaultValue={sale.cupsCount}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('total_amount')}</label>
                                    <input
                                        name="totalAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={sale.totalAmount}
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
                                        defaultValue={sale.cashAmount}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('network_amount')}</label>
                                    <input
                                        name="networkAmount"
                                        type="number"
                                        step="0.01"
                                        defaultValue={sale.networkAmount}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('disease_complaint')}</label>
                                <input
                                    name="disease"
                                    defaultValue={sale.disease || ""}
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1 flex items-center gap-1">
                                    <Calendar size={10} />
                                    التاريخ والوقت
                                </label>
                                <div className="relative">
                                    <input
                                        type="datetime-local"
                                        value={saleDateTime}
                                        onChange={(e) => setSaleDateTime(e.target.value)}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none [color-scheme:dark]"
                                    />
                                    <input type="hidden" name="saleDate" value={saleDateTime} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('offers_discounts')}</label>
                                    <input
                                        name="offers"
                                        defaultValue={sale.offers || ""}
                                        className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('notes')}</label>
                                    <input
                                        name="notes"
                                        defaultValue={sale.notes || ""}
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
                                    state.message === "Sale updated successfully!" ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {state.message === "Sale updated successfully!" ? t('sale_updated_success') || "Sale updated successfully!" : state.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
