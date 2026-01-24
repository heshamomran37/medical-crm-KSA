import { prisma } from "@/lib/prisma";
import { EmployeesPageClient } from "@/components/employees/EmployeesPageClient";
import EmployeesSkeleton from "@/components/employees/EmployeesSkeleton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { Suspense } from "react";

async function getEmployees(query: string, page: number = 1, limit: number = 12) {
    const skip = (page - 1) * limit;
    const where: Prisma.EmployeeWhereInput = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { role: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
        ];
    }

    const [employees, totalCount] = await Promise.all([
        prisma.employee.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        }),
        prisma.employee.count({ where })
    ]);

    return {
        employees,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
    };
}

export default async function EmployeesPage({ searchParams }: { searchParams: Promise<{ page?: string, q?: string }> }) {
    const params = await searchParams;
    const page = parseInt(params.page || "1") || 1;
    const q = params.q || "";

    return (
        <Suspense key={q + page} fallback={<EmployeesSkeleton />}>
            <EmployeesDataWrapper q={q} page={page} />
        </Suspense>
    );
}

async function EmployeesDataWrapper({ q, page }: { q: string, page: number }) {
    const session = await auth();
    const limit = 12;

    const userRole = session?.user?.role;
    const userType = session?.user?.userType;
    const userName = session?.user?.name;

    const isAdmin = userType === "ADMIN" || userRole === "ADMIN" || userName?.toLowerCase() === "admin";

    if (!isAdmin) {
        redirect("/dashboard");
    }

    const { employees, totalPages } = await getEmployees(q, page, limit);

    return (
        <EmployeesPageClient
            employees={employees}
            totalPages={totalPages}
            currentPage={page}
            query={q}
        />
    );
}
