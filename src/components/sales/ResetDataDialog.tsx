"use client";

import { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { deleteAllSalesAndExpenses } from "@/lib/actions";

export function ResetDataDialog() {
    const { t, isRTL } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState("");

    async function handleReset() {
        if (!confirm(isRTL ? "هل أنت متأكد تماماً؟ هذا الإجراء لا يمكن التراجع عنه!" : "Are you absolutely sure? This cannot be undone!")) {
            return;
        }

        setIsPending(true);
        setMessage("");

        try {
            const result = await deleteAllSalesAndExpenses();
            setMessage(result.message);
            if (result.success) {
                setTimeout(() => setIsOpen(false), 2000);
            }
        } catch (error) {
            setMessage(isRTL ? "حدث خطأ أثناء مسح البيانات" : "An error occurred while resetting data");
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all border border-red-500/20 active:scale-95",
                    isRTL && "flex-row-reverse"
                )}
            >
                <Trash2 size={16} />
                <span>{isRTL ? "مسح التقرير المالي" : "Reset Financial Data"}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div
                        className="bg-[#0f172a] border border-red-500/30 p-6 rounded-3xl shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-4 relative"
                        dir={isRTL ? "rtl" : "ltr"}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4 mb-6 mt-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <AlertTriangle size={32} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {isRTL ? "تحذير هام جداً!" : "Critical Warning!"}
                                </h3>
                                <p className="text-sm text-slate-400">
                                    {isRTL
                                        ? "أنت على وشك مسح جميع بيانات المبيعات والمصروفات من النظام بشكل نهائي! هل أنت متأكد أنك تريد الاستمرار؟"
                                        : "You are about to permanently delete all sales and expenses data from the system! Are you sure you want to proceed?"}
                                </p>
                            </div>
                        </div>

                        {message && (
                            <div className={cn(
                                "mb-4 p-3 rounded-xl text-center text-sm font-bold animate-in fade-in",
                                message.includes("success") || message.includes("تم") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                            )}>
                                {message}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                                disabled={isPending}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={isPending}
                                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                            >
                                {isPending ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        <span>{isRTL ? "تأكيد المسح" : "Confirm Reset"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
