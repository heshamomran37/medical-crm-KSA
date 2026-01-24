"use client";

import { Download, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { generateBackup, restoreBackup } from "@/lib/backup-actions";
import { useActionState, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const initialState = {
    message: ""
};

export default function BackupPageClient() {
    const { t, isRTL } = useLanguage();
    const [restoreState, restoreAction, isPending] = useActionState(restoreBackup, initialState);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const json = await generateBackup();
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `medcrm-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            alert("Failed to download backup");
        }
        setDownloading(false);
    };

    return (
        <div className={cn("flex flex-col h-full space-y-6", isRTL && "text-right")} dir={isRTL ? "rtl" : "ltr"}>
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground font-serif">{t('data_management')}</h1>
                <p className="text-muted-foreground mt-1">{t('backup_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className={cn("h-12 w-12 rounded-lg bg-blue-100/50 text-blue-600 flex items-center justify-center mb-4 border border-blue-200", isRTL && "mr-0 ml-auto")}>
                            <Download size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{t('export_data')}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t('export_desc')}
                        </p>
                        <div className="mt-4 p-3 bg-secondary/50 rounded-md flex items-start gap-2">
                            <AlertCircle size={16} className="text-primary mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">
                                This does not include system configuration or images. Only database records.
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="mt-6 w-full h-10 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        {downloading ? t('generating') : (
                            <>
                                <Download size={16} /> {t('download_backup')}
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className={cn("h-12 w-12 rounded-lg bg-orange-100/50 text-orange-600 flex items-center justify-center mb-4 border border-orange-200", isRTL && "mr-0 ml-auto")}>
                            <Upload size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">{t('import_data')}</h3>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t('import_desc')}
                        </p>
                        <div className="mt-4 p-3 bg-secondary/50 rounded-md flex items-start gap-2">
                            <AlertCircle size={16} className="text-orange-600 mt-0.5 shrink-0" />
                            <span className="text-xs text-muted-foreground">
                                Duplicate records (by ID or Email) will be skipped. New records will be added.
                            </span>
                        </div>
                    </div>

                    <form action={restoreAction} className="mt-6 space-y-3">
                        <div className="relative">
                            <input
                                type="file"
                                name="file"
                                accept=".json"
                                required
                                className="w-full text-sm text-muted-foreground
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-secondary file:text-secondary-foreground
                                  hover:file:bg-secondary/80
                                  cursor-pointer border border-input rounded-md p-1"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full h-10 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 border border-border"
                        >
                            {isPending ? t('restoring') : (
                                <>
                                    <Upload size={16} /> {t('restore_data')}
                                </>
                            )}
                        </button>
                        {restoreState?.message && (
                            <div className={cn(
                                "text-xs text-center flex items-center justify-center gap-1",
                                restoreState.message.includes("success") ? "text-green-600" : "text-red-500"
                            )}>
                                {restoreState.message.includes("success") && <CheckCircle size={12} />}
                                {restoreState.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
