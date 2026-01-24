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

export async function generateBackup() {
    try {
        const [patients, employees, logs] = await Promise.all([
            prisma.patient.findMany(),
            prisma.employee.findMany(),
            prisma.activityLog.findMany()
        ]);

        const data = {
            timestamp: new Date().toISOString(),
            patients,
            employees,
            logs
        };

        await logActivity("GENERATE_BACKUP", `Created full system backup containing ${patients.length} patients and ${employees.length} staff.`);
        return JSON.stringify(data, null, 2);
    } catch (e) {
        console.error("Backup failed:", e);
        throw new Error("Failed to generate backup");
    }
}

export async function restoreBackup(prevState: Record<string, unknown> | undefined, formData: FormData) {
    try {
        const file = formData.get("file") as File;
        if (!file) return { message: "No file provided" };

        const text = await file.text();
        const data = JSON.parse(text);

        if (!data.patients || !data.employees) {
            return { message: "Invalid backup file format" };
        }

        // Transaction to ensure data integrity
        await prisma.$transaction(async (tx) => {
            // Restore Patients
            for (const p of data.patients) {
                // Upsert to avoid duplicates by ID or critical fields
                // Simpler approach: create if not exists
                const exists = await tx.patient.findFirst({ where: { OR: [{ id: p.id }, { email: p.email }] } });
                if (!exists) {
                    // Remove id collision risk by letting DB assign ID if possible, 
                    // BUT for restore we often want to keep IDs. 
                    // Strategy: specific upsert logic or just createMany with skipDuplicates if supported (Postgres supports it but Prisma method varies)

                    // Cleanup relation fields potentially (if any)
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...rest } = p;
                    await tx.patient.create({ data: rest });
                }
            }

            // Restore Employees
            for (const e of data.employees) {
                const exists = await tx.employee.findFirst({ where: { OR: [{ id: e.id }, { email: e.email }] } });
                if (!exists) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { id, ...rest } = e;
                    await tx.employee.create({ data: rest });
                }
            }
        });

        revalidatePath("/dashboard");
        revalidatePath("/patients");
        revalidatePath("/employees");

        await logActivity("RESTORE_BACKUP", `Restored data from backup file. (Imported patients/employees)`);
        return { message: "Data restored successfully! (Duplicates skipped)" };
    } catch (e) {
        console.error("Restore failed:", e);
        return { message: "Failed to restore data. Check file format." };
    }
}
