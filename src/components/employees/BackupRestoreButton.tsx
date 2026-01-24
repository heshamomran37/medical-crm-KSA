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
                className="flex items-center gap-2 px-4 h-10 rounded-xl border-2 border-[#0a192f] text-[#0a192f] hover:bg-[#0a192f] hover:text-white font-bold text-sm transition-all shadow-sm hover:shadow-md"
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
