"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createExpense } from "@/lib/actions";
import { Receipt, X } from "lucide-react";
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
            className="h-10 px-4 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 w-full flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {pending ? t('saving') : t('add_expense')}
        </button>
    );
}

export function ExpenseDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [state, formAction] = useActionState(createExpense, initialState);
    const { t, isRTL } = useLanguage();

    useEffect(() => {
        if (state?.message === "Expense added successfully!") {
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
                className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-bold hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
            >
                <Receipt size={16} />
                {t('add_expense')}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={cn(
                        "bg-[#0a192f] w-full max-w-md p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300",
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

                        <h2 className="text-2xl font-serif italic text-white mb-6 uppercase tracking-tight">{t('add_expense')}</h2>

                        <form action={formAction} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('expense_title')}</label>
                                <input
                                    name="title"
                                    required
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                    placeholder="Ex: Electricity Bill"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('amount')}</label>
                                <input
                                    name="amount"
                                    type="number"
                                    step="0.01"
                                    required
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('category')}</label>
                                <select
                                    name="category"
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-[#0d213f] text-white focus:border-[#b78a5d]/50 outline-none appearance-none"
                                >
                                    <option value="Supplies">{t('supplies')}</option>
                                    <option value="Rent">{t('rent')}</option>
                                    <option value="Electricity">{t('electricity')}</option>
                                    <option value="Other">{t('other')}</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[#b78a5d] ml-1">{t('date')}</label>
                                <input
                                    name="date"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full h-12 px-4 rounded-2xl border border-white/5 bg-white/5 text-white focus:border-[#b78a5d]/50 outline-none"
                                />
                            </div>

                            <div className="pt-4">
                                <SubmitButton />
                            </div>

                            {state?.message && (
                                <p className={cn(
                                    "text-sm text-center font-bold animate-in fade-in duration-300",
                                    state.message === "Expense added successfully!" ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {state.message === "Expense added successfully!" ? t('expense_added_success') : state.message}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
