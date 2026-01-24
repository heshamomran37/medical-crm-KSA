import DashboardLayout from "@/components/layout/DashboardLayout";
export const revalidate = 30; // Revalidate every 30 seconds
import { prisma } from "@/lib/prisma";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { auth } from "@/auth";
import { Suspense } from "react";

export default async function DashboardPage() {
    const session = await auth();
    const userRole = session?.user?.role || session?.user?.userType;
    const isAdmin = userRole === 'ADMIN';

    // Move fetching into a separate component or handle here
    // For simplicity with the current structure, we fetch and pass to content
    // But wrapping in Suspense at a higher level if needed.

    return (
        <DashboardLayout>
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardDataWrapper isAdmin={isAdmin} userId={session?.user?.id} />
            </Suspense>
        </DashboardLayout>
    );
}

async function DashboardDataWrapper({ isAdmin, userId }: { isAdmin: boolean, userId?: string }) {
    const [totalPatients, activeEmployees] = await Promise.all([
        prisma.patient.count({
            where: isAdmin ? {} : { createdById: userId }
        }),
        prisma.employee.count({ where: { status: "Active" } })
    ]);

    const appointmentsToday = 0;
    const revenue = 0;

    return (
        <DashboardContent
            totalPatients={totalPatients}
            activeEmployees={activeEmployees}
            appointmentsToday={appointmentsToday}
            revenue={revenue}
        />
    );
}

// Extra icons needed

