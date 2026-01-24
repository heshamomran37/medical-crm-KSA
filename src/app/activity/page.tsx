import DashboardLayout from "@/components/layout/DashboardLayout";
import { prisma } from "@/lib/prisma";
import ActivityPageClient from "@/components/activity/ActivityPageClient";
import ActivitySkeleton from "@/components/activity/ActivitySkeleton";
import { Suspense } from "react";
import { auth } from "@/auth";

export default async function ActivityPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<ActivitySkeleton />}>
                <ActivityDataWrapper />
            </Suspense>
        </DashboardLayout>
    );
}

async function ActivityDataWrapper() {
    await auth();

    const activities = await prisma.activityLog.findMany({
        take: 20,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <ActivityPageClient activities={activities} />;
}
