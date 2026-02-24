"use client";

import { useState, useRef } from "react";
import { Download, Upload, Trash2, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { exportEmployees, importEmployees, clearAllEmployees } from "@/lib/backup-employees";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface BackupRestoreDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function BackupRestoreDialog({ isOpen, onClose }: BackupRestoreDialogProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t, isRTL } = useLanguage();

    if (!isOpen) return null;

    const handleExport = async () => {
        setIsExporting(true);
        setMessage(null);

        try {
            const result = await exportEmployees();

            if (result.success && result.data) {
                // Create JSON file and download
                const dataStr = JSON.stringify(result.data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `employees_backup_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setMessage({
                    type: 'success',
                    text: `${t('export_success')}: ${result.count}`
                });
            } else {
                setMessage({
                    type: 'error',
                    text: result.error || t('export_failed')
                });
            }
        } catch {
            setMessage({
                type: 'error',
                text: t('export_failed')
            });
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        setMessage(null);

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            const result = await importEmployees(data);

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `${t('import_success')}: ${result.imported} new, ${result.updated} updated`
                });

                // Refresh the page after 2 seconds
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                setMessage({
                    type: 'error',
                    text: result.error || t('import_failed')
                });
            }
        } catch {
            setMessage({
                type: 'error',
                text: t('invalid_json')
            });
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClearAll = async () => {
        const confirmed = window.confirm(
            isRTL
                ? '⚠️ تحذير: سيؤدي هذا إلى حذف جميع الموظفين بشكل دائم!\n\nهل أنت متأكد تمامًا؟'
                : '⚠️ WARNING: This will DELETE ALL employees permanently!\n\nAre you absolutely sure?'
        );

        if (!confirmed) return;

        const doubleConfirm = window.confirm(
            isRTL
                ? 'لا يمكن التراجع عن هذا الإجراء!\n\nاكتب نعم في المرة القادمة للتأكيد.'
                : 'This action CANNOT be undone!\n\nType YES in the next prompt to confirm.'
        );

        if (!doubleConfirm) return;

        try {
            const result = await clearAllEmployees();

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: `${t('clear_success')}: ${result.deleted}`
                });

                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setMessage({
                    type: 'error',
                    text: result.error || t('clear_failed')
                });
            }
        } catch {
            setMessage({
                type: 'error',
                text: t('clear_failed')
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={cn(
                "bg-[#0a192f] rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 relative animate-in fade-in slide-in-from-bottom-8 border border-white/10",
                isRTL && "text-right"
            )} dir={isRTL ? "rtl" : "ltr"}>
                <button
                    onClick={onClose}
                    className={cn(
                        "absolute top-6 text-slate-400 hover:text-slate-600 transition-colors uppercase",
                        isRTL ? "left-6" : "right-6"
                    )}
                >
                    <X size={24} />
                </button>

                <div className="mb-8">
                    <h2 className="text-3xl font-serif italic text-white mb-2">{t('backup_restore')}</h2>
                    <p className="text-sm text-slate-400 font-medium">{t('backup_mgmt')}</p>
                </div>

                {message && (
                    <div className={cn(
                        "mb-6 p-4 rounded-2xl flex items-start gap-3",
                        message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-red-50 text-red-700 border border-red-200',
                        isRTL && "flex-row-reverse"
                    )}>
                        {message.type === 'success' ? (
                            <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full h-14 bg-white/5 border border-white/10 hover:bg-[#b78a5d] hover:border-[#b78a5d] text-white rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        <Download size={20} />
                        {isExporting ? t('exporting') : t('export_json')}
                    </button>

                    {/* Import Button */}
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            className="hidden"
                            id="import-file"
                        />
                        <label
                            htmlFor="import-file"
                            className={cn(
                                "w-full h-14 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:border-emerald-600 text-white rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer",
                                isImporting && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Upload size={20} />
                            {isImporting ? t('importing') : t('import_json')}
                        </label>
                    </div>

                    {/* Clear All Button */}
                    <button
                        onClick={handleClearAll}
                        className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                    >
                        <Trash2 size={20} />
                        {t('clear_all_employees')}
                    </button>
                </div>

                <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
                    <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                        <AlertTriangle size={18} className="text-[#f59e0b] flex-shrink-0 mt-0.5" />
                        <div className={cn("text-[11px] text-slate-400 font-medium", isRTL && "text-right")}>
                            <p className="text-[#f59e0b] font-black uppercase tracking-widest mb-2">{t('important_notes')}:</p>
                            <ul className={cn("list-disc space-y-2", isRTL ? "pr-4" : "pl-4")}>
                                <li>{t('export_note')}</li>
                                <li>{t('import_note')}</li>
                                <li>{t('clear_note')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
