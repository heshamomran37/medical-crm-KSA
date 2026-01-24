import DashboardLayout from "@/components/layout/DashboardLayout";
import SettingsPageClient from "@/components/settings/SettingsPageClient";
import SettingsSkeleton from "@/components/settings/SettingsSkeleton";
import { Suspense } from "react";

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<SettingsSkeleton />}>
                <SettingsPageClient />
            </Suspense>
        </DashboardLayout>
    );
}
