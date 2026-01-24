import { prisma } from "@/lib/prisma";
import { PatientsPageClient } from "@/components/patients/PatientsPageClient";
import PatientsSkeleton from "@/components/patients/PatientsSkeleton";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import { Session } from "next-auth";
import { Suspense } from "react";

async function getPatients(query: string, type: string, session: Session | null, page: number = 1, limit: number = 12) {
    const where: Prisma.PatientWhereInput = {};
    const skip = (page - 1) * limit;

    const userRole = session?.user?.role || session?.user?.userType;
    if (userRole !== 'ADMIN') {
        where.createdById = session?.user?.id;
    }

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
        ];
    }
    if (type && type !== 'All' && type !== '') {
        where.type = type;
    }

    const [patients, totalCount] = await Promise.all([
        prisma.patient.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.patient.count({ where })
    ]);

    return {
        patients,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export default async function PatientsPage({ searchParams }: { searchParams: Promise<{ q?: string, type?: string, page?: string }> }) {
    const params = await searchParams;
    const q = params.q || "";
    const type = params.type || "";
    const page = parseInt(params.page || "1") || 1;

    return (
        <Suspense key={q + type + page} fallback={<PatientsSkeleton />}>
            <PatientsDataWrapper q={q} type={type} page={page} />
        </Suspense>
    );
}

async function PatientsDataWrapper({ q, type, page }: { q: string, type: string, page: number }) {
    const session = await auth();
    const limit = 12;
    const { patients, totalPages } = await getPatients(q, type, session, page, limit);

    return (
        <PatientsPageClient
            patients={patients}
            query={q}
            type={type}
            totalPages={totalPages}
            currentPage={page}
        />
    );
}
