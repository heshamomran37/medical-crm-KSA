"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import WhatsAppSkeleton from "@/components/whatsapp/WhatsAppSkeleton";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const WhatsAppPageClient = dynamic(() => import("@/components/whatsapp/WhatsAppPageClient"), {
    ssr: false,
    loading: () => <WhatsAppSkeleton />
});

export default function WhatsAppPage() {
    return (
        <DashboardLayout>
            <WhatsAppPageClient />
        </DashboardLayout>
    );
}
