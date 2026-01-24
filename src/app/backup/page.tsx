import DashboardLayout from "@/components/layout/DashboardLayout";
import BackupPageClient from "@/components/backup/BackupPageClient";
import BackupSkeleton from "@/components/backup/BackupSkeleton";
import { Suspense } from "react";

export default function BackupPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<BackupSkeleton />}>
                <BackupPageClient />
            </Suspense>
        </DashboardLayout>
    );
}
