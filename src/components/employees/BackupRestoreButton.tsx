"use client";

import { useState } from "react";
import { Database } from "lucide-react";
import { BackupRestoreDialog } from "./BackupRestoreDialog";
import { useLanguage } from "@/context/LanguageContext";

export function BackupRestoreButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-3 px-6 h-10 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-[#b78a5d] hover:text-white font-bold text-sm transition-all shadow-xl"
            >
                <Database size={18} />
                {t('backup_restore')}
            </button>

            <BackupRestoreDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
