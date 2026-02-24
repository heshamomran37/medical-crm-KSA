"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Ban, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { Employee } from "@prisma/client";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { toggleEmployeeStatus, deleteEmployee } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function EmployeeActions({ employee }: { employee: Employee }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const { t, isRTL } = useLanguage();

    const handleToggleStatus = async () => {
        await toggleEmployeeStatus(employee.id, employee.status);
        setIsMenuOpen(false);
    };

    const handleDelete = async () => {
        const result = await deleteEmployee(employee.id);
        if (result.success) {
            setIsDeleteConfirmOpen(false);
        } else {
            alert(result.message);
        }
    };

    return (
        <>
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-secondary transition-colors"
                >
                    <MoreHorizontal size={20} />
                </button>

                {isMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                        <div className={cn(
                            "absolute top-full mt-2 w-52 bg-[#0a192f] border border-white/20 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-150 overflow-hidden",
                            isRTL ? "left-0" : "right-0"
                        )}>
                            <button
                                onClick={() => {
                                    setIsEditOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full px-5 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3 text-white font-medium",
                                    isRTL ? "text-right flex-row-reverse" : "text-left"
                                )}
                            >
                                <Edit size={16} className="text-[#f59e0b]" /> {t('edit_details')}
                            </button>
                            <button
                                onClick={handleToggleStatus}
                                className={cn(
                                    "w-full px-5 py-3 text-sm hover:bg-white/5 transition-colors flex items-center gap-3 font-medium",
                                    isRTL ? "text-right flex-row-reverse" : "text-left",
                                    employee.status === "Active" ? "text-red-400" : "text-emerald-400"
                                )}
                            >
                                {employee.status === "Active" ? (
                                    <>
                                        <Ban size={16} /> {t('disable_access')}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={16} /> {t('enable_access')}
                                    </>
                                )}
                            </button>
                            <div className="border-t border-white/10 my-1"></div>
                            <button
                                onClick={() => {
                                    setIsDeleteConfirmOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full px-5 py-3 text-sm hover:bg-red-500/10 text-red-400 transition-colors flex items-center gap-3 font-medium",
                                    isRTL ? "text-right flex-row-reverse" : "text-left"
                                )}
                            >
                                <Trash2 size={16} /> {t('delete')}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <EditEmployeeDialog
                employee={employee}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
            />

            {/* Delete Confirmation Dialog */}
            {isDeleteConfirmOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-[#0a192f] rounded-[2rem] shadow-2xl border border-white/10 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                                    <AlertTriangle size={28} />
                                </div>
                                <h3 className="text-2xl font-serif italic text-white">{t('confirm_delete')}</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-medium">
                                {t('delete_confirm_msg')}
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 flex gap-4 justify-end border-t border-white/10">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="px-8 py-3 rounded-xl border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/5 transition-all"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-8 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-xl shadow-red-900/40 transition-all"
                            >
                                {t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
