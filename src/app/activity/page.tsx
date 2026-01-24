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
    const session = await auth();
    const userRole = session?.user?.role || session?.user?.userType;
    const isAdmin = userRole === 'ADMIN';

    const where: any = {};
    if (!isAdmin && session?.user?.name) {
        where.userId = session.user.name;
    }

    const activities = await prisma.activityLog.findMany({
        where,
        take: 20,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return <ActivityPageClient activities={activities} />;
}
