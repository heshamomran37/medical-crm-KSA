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
                            "absolute top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100",
                            isRTL ? "left-0" : "right-0"
                        )}>
                            <button
                                onClick={() => {
                                    setIsEditOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-2.5 text-sm hover:bg-secondary flex items-center gap-2 text-foreground",
                                    isRTL ? "text-right flex-row-reverse" : "text-left"
                                )}
                            >
                                <Edit size={14} /> {t('edit_details')}
                            </button>
                            <button
                                onClick={handleToggleStatus}
                                className={cn(
                                    "w-full px-4 py-2.5 text-sm hover:bg-secondary flex items-center gap-2",
                                    isRTL ? "text-right flex-row-reverse" : "text-left",
                                    employee.status === "Active" ? "text-red-500" : "text-green-600"
                                )}
                            >
                                {employee.status === "Active" ? (
                                    <>
                                        <Ban size={14} /> {t('disable_access')}
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={14} /> {t('enable_access')}
                                    </>
                                )}
                            </button>
                            <div className="border-t border-border my-1"></div>
                            <button
                                onClick={() => {
                                    setIsDeleteConfirmOpen(true);
                                    setIsMenuOpen(false);
                                }}
                                className={cn(
                                    "w-full px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2",
                                    isRTL ? "text-right flex-row-reverse" : "text-left"
                                )}
                            >
                                <Trash2 size={14} /> {t('delete')}
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{t('confirm_delete')}</h3>
                            </div>
                            <p className="text-slate-600 leading-relaxed">
                                {t('delete_confirm_msg')}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 flex gap-3 justify-end">
                            <button
                                onClick={() => setIsDeleteConfirmOpen(false)}
                                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
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
