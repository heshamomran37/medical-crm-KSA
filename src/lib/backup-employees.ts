import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function logActivity(action: string, description: string) {
    try {
        const session = await auth();
        await prisma.activityLog.create({
            data: {
                action,
                description,
                userId: session?.user?.name || "System",
            },
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
}

export async function exportEmployees() {
    try {
        const employees = await prisma.employee.findMany({
            orderBy: { createdAt: 'desc' }
        });

        await logActivity("EXPORT_STAFF", `Exported data for ${employees.length} staff members.`);
        return {
            success: true,
            data: employees,
            timestamp: new Date().toISOString(),
            count: employees.length
        };
    } catch (error) {
        console.error("Export failed:", error);
        return {
            success: false,
            error: "Failed to export employees"
        };
    }
}

export async function importEmployees(employeesData: unknown[]) {
    try {
        // Validate data structure
        if (!Array.isArray(employeesData) || employeesData.length === 0) {
            return {
                success: false,
                error: "Invalid data format"
            };
        }

        let imported = 0;
        let updated = 0;
        let errors = 0;

        for (const empData of employeesData) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const emp = empData as any;
                // Check if employee exists by username or id
                const existing = emp.username
                    ? await prisma.employee.findFirst({
                        where: { username: emp.username }
                    })
                    : null;

                if (existing) {
                    // Update existing employee
                    await prisma.employee.update({
                        where: { id: existing.id },
                        data: {
                            name: emp.name,
                            role: emp.role,
                            status: emp.status || "Active",
                            email: emp.email || null,
                            phone: emp.phone || null,
                            whatsapp: emp.whatsapp || null,
                            address: emp.address || null,
                            department: emp.department || null,
                            password: emp.password || null,
                        }
                    });
                    updated++;
                } else {
                    // Create new employee (without id to let DB generate it)
                    await prisma.employee.create({
                        data: {
                            name: emp.name,
                            role: emp.role,
                            status: emp.status || "Active",
                            email: emp.email || null,
                            phone: emp.phone || null,
                            whatsapp: emp.whatsapp || null,
                            address: emp.address || null,
                            department: emp.department || null,
                            username: emp.username || null,
                            password: emp.password || null,
                        }
                    });
                    imported++;
                }
            } catch (err) {
                console.error("Error processing employee:", empData, err);
                errors++;
            }
        }

        revalidatePath("/employees");
        await logActivity("IMPORT_STAFF", `Imported/Updated staff via JSON. (Imported: ${imported}, Updated: ${updated})`);

        return {
            success: true,
            imported,
            updated,
            errors,
            total: employeesData.length
        };
    } catch (error) {
        console.error("Import failed:", error);
        return {
            success: false,
            error: "Failed to import employees"
        };
    }
}

export async function clearAllEmployees() {
    try {
        const result = await prisma.employee.deleteMany({});
        revalidatePath("/employees");

        await logActivity("CLEAR_STAFF", `DELETED ALL STAFF MEMBERS (${result.count} entries).`);
        return {
            success: true,
            deleted: result.count
        };
    } catch (error) {
        console.error("Clear failed:", error);
        return {
            success: false,
            error: "Failed to clear employees"
        };
    }
}
