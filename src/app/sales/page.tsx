import { auth } from "@/auth";
import { getSalesSummary, getUnifiedAnalytics } from "@/lib/actions";
import { SalesPageClient } from "@/components/sales/SalesPageClient";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SalesPage() {
    const session = await auth();
    if (!session) redirect("/login");

    // Fetch initial data
    const { sales, totals } = await getSalesSummary();
    const analytics = await getUnifiedAnalytics();

    // Fetch patients for the "Add Sale" dialog
    const patients = await prisma.patient.findMany({
        select: {
            id: true,
            name: true,
            gender: true,
            phone: true,
        },
        orderBy: { name: 'asc' }
    });

    return (
        <SalesPageClient
            initialSales={sales}
            initialTotals={totals}
            analytics={analytics}
            patients={patients}
        />
    );
}
