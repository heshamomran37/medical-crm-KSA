"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { z } from "zod";

// --- VALIDATION SCHEMAS ---

const EmployeeSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    role: z.string().min(2, "Role is required"),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    instagram: z.string().optional(),
    snapchat: z.string().optional(),
    address: z.string().optional(),
    username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
    password: z.string().min(3, "Password must be at least 3 characters").optional().or(z.literal("")),
});

const PatientSchema = z.object({
    name: z.string().min(2, "Name is required"),
    type: z.enum(["Individual", "Company"]),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    telegram: z.string().optional(),
    instagram: z.string().optional(),
    snapchat: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
    address: z.string().optional(),

    gender: z.string().optional(),
    birthDate: z.string().optional(),
    status: z.string().optional(),
    followUpStatus: z.string().optional(),
});

const SaleSchema = z.object({
    patientId: z.string().min(1, "Patient is required"),
    gender: z.string().optional(),
    cupsCount: z.coerce.number().int().nonnegative().default(0),
    disease: z.string().optional(),
    totalAmount: z.coerce.number().nonnegative().default(0),
    cashAmount: z.coerce.number().nonnegative().default(0),
    networkAmount: z.coerce.number().nonnegative().default(0),
    offers: z.string().optional(),
    notes: z.string().optional(),
    saleDate: z.string().optional(),
});

const ExpenseSchema = z.object({
    title: z.string().min(2, "Title is required"),
    amount: z.coerce.number().positive("Amount must be positive"),
    category: z.string().optional(),
    notes: z.string().optional(),
    date: z.string().optional(),
});

// --- HELPER: LOG ACTIVITY ---

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

// --- AUTH ACTIONS ---

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn("credentials", {
            username: formData.get("username"),
            password: formData.get("password"),
            redirect: false,
        });

        // If we get here, login was successful (no error thrown)
        // We can manually redirect now
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return "Invalid credentials.";
                default:
                    return "Something went wrong.";
            }
        }
        throw error;
    }

    // Manual redirect after successful login (outside try-catch to avoid catching NEXT_REDIRECT)
    // However, since we used redirect: false, signIn won't throw a redirect error.
    // So we can just redirect explicitly.
    const { redirect } = await import("next/navigation");
    redirect("/dashboard");
}

export async function signOutAction() {
    await signOut({ redirectTo: "/login" });
}

// --- EMPLOYEE ACTIONS ---

export async function createEmployee(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = EmployeeSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const { name, role, email, phone, whatsapp, telegram, instagram, snapchat, address, username, password } = validatedFields.data;

        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        await prisma.employee.create({
            data: {
                name,
                role,
                email: email || null,
                phone: phone || null,
                whatsapp: whatsapp || null,
                telegram: telegram || null,
                instagram: instagram || null,
                snapchat: snapchat || null,
                address: address || null,
                username: username || null,
                password: hashedPassword,
                status: "Active",
            },
        });

        await logActivity("CREATE_EMPLOYEE", `Added new employee: ${name} (${role})`);
        revalidatePath("/employees");
        return { message: "Employee added successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to create employee." };
    }
}

export async function updateEmployee(id: string, prevState: { message: string } | undefined, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = EmployeeSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const { name, role, email, phone, whatsapp, telegram, instagram, snapchat, address, username, password } = validatedFields.data;

        const data: {
            name: string;
            role: string;
            email: string | null;
            phone: string | null;
            whatsapp: string | null;
            telegram: string | null;
            instagram: string | null;
            snapchat: string | null;
            address: string | null;
            username: string | null;
            password?: string;
        } = {
            name,
            role,
            email: email || null,
            phone: phone || null,
            whatsapp: whatsapp || null,
            telegram: telegram || null,
            instagram: instagram || null,
            snapchat: snapchat || null,
            address: address || null,
            username: username || null,
        };

        if (password && password.trim() !== "") {
            data.password = await bcrypt.hash(password, 10);
        }

        await prisma.employee.update({
            where: { id },
            data,
        });

        await logActivity("UPDATE_EMPLOYEE", `Updated employee profile: ${name}`);
        revalidatePath("/employees");
        return { message: "Employee updated successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to update employee." };
    }
}

export async function toggleEmployeeStatus(id: string, currentStatus: string) {
    try {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        const employee = await prisma.employee.update({
            where: { id },
            data: { status: newStatus },
        });

        await logActivity("TOGGLE_EMPLOYEE", `Marked ${employee.name} as ${newStatus}`);
        revalidatePath("/employees");
        return { success: true, message: `Employee marked as ${newStatus}` };
    } catch {
        return { success: false, message: "Failed to update status" };
    }
}

// --- PATIENT ACTIONS ---

export async function createPatient(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const session = await auth();
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = PatientSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const data = validatedFields.data;

        await prisma.patient.create({
            data: {
                ...data,
                email: data.email || null,
                phone: data.phone || null,
                whatsapp: data.whatsapp || null,
                telegram: data.telegram || null,
                instagram: data.instagram || null,
                snapchat: data.snapchat || null,
                facebook: data.facebook || null,
                tiktok: data.tiktok || null,
                address: data.address || null,
                gender: data.gender || null,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                status: data.status || "New",
                followUpStatus: data.followUpStatus || null,
                createdById: session?.user?.id || null,
            },
        });

        await logActivity("CREATE_PATIENT", `Registered new patient: ${data.name}`);
        revalidatePath("/patients");
        revalidatePath("/dashboard");
        return { message: "Patient added successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to create patient." };
    }
}

export async function updatePatient(id: string, prevState: { message: string } | undefined, formData: FormData) {
    try {
        const session = await auth();
        const userRole = session?.user?.role || session?.user?.userType;
        const isAdmin = userRole === 'ADMIN';

        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = PatientSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const data = validatedFields.data;

        // Privacy check
        if (!isAdmin) {
            const existing = await prisma.patient.findUnique({ where: { id } });
            if (existing && existing.createdById !== session?.user?.id) {
                return { message: "Unauthorized: You can only edit your own patients." };
            }
        }

        await prisma.patient.update({
            where: { id },
            data: {
                ...data,
                email: data.email || null,
                phone: data.phone || null,
                whatsapp: data.whatsapp || null,
                telegram: data.telegram || null,
                instagram: data.instagram || null,
                snapchat: data.snapchat || null,
                facebook: data.facebook || null,
                tiktok: data.tiktok || null,
                address: data.address || null,
                gender: data.gender || null,
                birthDate: data.birthDate ? new Date(data.birthDate) : null,
                status: data.status || "New",
                followUpStatus: data.followUpStatus || null,
            },
        });

        await logActivity("UPDATE_PATIENT", `Updated patient records: ${data.name}`);
        revalidatePath("/patients");
        return { message: "Patient updated successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to update patient." };
    }
}

export async function deletePatient(id: string) {
    try {
        const session = await auth();
        const userRole = session?.user?.role || session?.user?.userType;
        const isAdmin = userRole === 'ADMIN';

        // Privacy check
        if (!isAdmin) {
            const existing = await prisma.patient.findUnique({ where: { id } });
            if (existing && existing.createdById !== session?.user?.id) {
                return { success: false, message: "Unauthorized: You can only delete your own patients." };
            }
        }

        const patient = await prisma.patient.delete({
            where: { id },
        });

        await logActivity("DELETE_PATIENT", `Deleted patient record: ${patient.name}`);
        revalidatePath("/patients");
        return { success: true, message: "Patient deleted successfully!" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to delete patient." };
    }
}
export async function deleteEmployee(id: string) {
    try {
        const session = await auth();
        const userRole = session?.user?.role;
        const userType = session?.user?.userType;
        const isAdmin = userType === "ADMIN" || userRole === "ADMIN";

        if (!isAdmin) {
            return { success: false, message: "Unauthorized: Only administrators can delete employees." };
        }

        const employee = await prisma.employee.delete({
            where: { id },
        });

        await logActivity("DELETE_EMPLOYEE", `Deleted employee record: ${employee.name}`);
        revalidatePath("/employees");
        return { success: true, message: "Employee deleted successfully!" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to delete employee." };
    }
}

// --- EXCEL IMPORT ACTION ---

export async function importPatientsFromExcel(formData: FormData) {
    try {
        const session = await auth();
        const file = formData.get("file") as File;

        if (!file) {
            return { success: false, message: "No file provided" };
        }

        // Read file as array buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Dynamic import of xlsx to avoid bundling issues
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        const results = {
            total: data.length,
            success: 0,
            failed: 0,
            errors: [] as Array<{ row: number; name: string; error: string }>,
        };

        // Process each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i] as Record<string, unknown>;
            const rowNumber = i + 2; // +2 because Excel is 1-indexed and has header row

            try {
                // Validate required fields
                const name = row.name || row.Name || row.الاسم || row.NAME;
                if (!name || typeof name !== "string") {
                    throw new Error("Name is required");
                }

                // Extract and validate optional fields
                const type = (row.type || row.Type || row.النوع || "Individual") as string;
                const phone = (row.phone || row.Phone || row.الهاتف || "") as string;
                const email = (row.email || row.Email || row.الايميل || "") as string;
                const whatsapp = (row.whatsapp || row.WhatsApp || row.واتساب || "") as string;
                const address = (row.address || row.Address || row.العنوان || "") as string;
                const gender = (row.gender || row.Gender || row.الجنس || "") as string;
                const birthDate = row.birthDate || row.BirthDate || row.تاريخ_الميلاد || "";

                // Validate with Zod schema
                const validatedData = PatientSchema.parse({
                    name,
                    type: type === "Company" || type === "شركة" ? "Company" : "Individual",
                    phone: phone || undefined,
                    email: email || undefined,
                    whatsapp: whatsapp || undefined,
                    address: address || undefined,
                    gender: gender || undefined,
                    birthDate: birthDate ? String(birthDate) : undefined,
                    status: "New",
                });

                // Create patient
                await prisma.patient.create({
                    data: {
                        ...validatedData,
                        email: validatedData.email || null,
                        phone: validatedData.phone || null,
                        whatsapp: validatedData.whatsapp || null,
                        telegram: validatedData.telegram || null,
                        instagram: validatedData.instagram || null,
                        snapchat: validatedData.snapchat || null,
                        facebook: validatedData.facebook || null,
                        tiktok: validatedData.tiktok || null,
                        address: validatedData.address || null,
                        gender: validatedData.gender || null,
                        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
                        status: "New",
                        followUpStatus: null,
                        createdById: session?.user?.id || null,
                    },
                });

                results.success++;
            } catch (error) {
                results.failed++;
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                results.errors.push({
                    row: rowNumber,
                    name: String(row.name || row.Name || row.الاسم || "Unknown"),
                    error: errorMessage,
                });
            }
        }

        await logActivity("IMPORT_PATIENTS", `Imported ${results.success} patients from Excel (${results.failed} failed)`);
        revalidatePath("/patients");
        revalidatePath("/dashboard");

        return {
            success: true,
            message: `Successfully imported ${results.success} out of ${results.total} patients`,
            results,
        };
    } catch (e) {
        console.error("Import error:", e);
        return {
            success: false,
            message: e instanceof Error ? e.message : "Failed to import patients from Excel"
        };
    }
}

// --- SALE ACTIONS ---

export async function createSale(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const session = await auth();
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = SaleSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const data = validatedFields.data;

        await prisma.sale.create({
            data: {
                patientId: data.patientId,
                gender: data.gender,
                cupsCount: data.cupsCount,
                disease: data.disease || null,
                totalAmount: data.totalAmount,
                cashAmount: data.cashAmount,
                networkAmount: data.networkAmount,
                offers: data.offers || null,
                notes: data.notes || null,
                saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
                createdById: session?.user?.id || null,
            },
        });

        await logActivity("CREATE_SALE", `Recorded sale for patient ID: ${data.patientId}`);
        revalidatePath("/sales");
        revalidatePath("/dashboard");
        return { message: "Sale recorded successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to record sale." };
    }
}

export async function updateSale(id: string, prevState: { message: string } | undefined, formData: FormData) {
    try {
        const session = await auth();
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = SaleSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const data = validatedFields.data;

        await prisma.sale.update({
            where: { id },
            data: {
                patientId: data.patientId,
                gender: data.gender,
                cupsCount: data.cupsCount,
                disease: data.disease || null,
                totalAmount: data.totalAmount,
                cashAmount: data.cashAmount,
                networkAmount: data.networkAmount,
                offers: data.offers || null,
                notes: data.notes || null,
                saleDate: data.saleDate ? new Date(data.saleDate) : new Date(),
            },
        });

        await logActivity("UPDATE_SALE", `Updated sale record ID: ${id}`);
        revalidatePath("/sales");
        revalidatePath("/dashboard");
        return { message: "Sale updated successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to update sale." };
    }
}

export async function deleteSale(id: string) {
    try {
        const sale = await prisma.sale.delete({
            where: { id },
        });

        await logActivity("DELETE_SALE", `Deleted sale record for patient ID: ${sale.patientId}`);
        revalidatePath("/sales");
        revalidatePath("/dashboard");
        return { success: true, message: "Sale deleted successfully!" };
    } catch (e) {
        console.error(e);
        return { success: false, message: "Failed to delete sale." };
    }
}

export async function getSalesSummary(date?: Date) {
    try {
        const startOfDay = date ? new Date(date.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0));
        const endOfDay = new Date(startOfDay);
        endOfDay.setHours(23, 59, 59, 999);

        const sales = await prisma.sale.findMany({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const totals = sales.reduce((acc: any, sale: any) => {
            acc.total += sale.totalAmount;
            acc.cash += sale.cashAmount;
            acc.network += sale.networkAmount;
            if (sale.gender === 'Male') acc.men++;
            if (sale.gender === 'Female') acc.women++;
            return acc;
        }, { total: 0, cash: 0, network: 0, men: 0, women: 0 });

        return { sales, totals };
    } catch (e) {
        console.error(e);
        return { sales: [], totals: { total: 0, cash: 0, network: 0, men: 0, women: 0 } };
    }
}

// --- EXPENSE ACTIONS ---

export async function createExpense(prevState: { message: string } | undefined, formData: FormData) {
    try {
        const session = await auth();
        const rawData = Object.fromEntries(formData.entries());
        const validatedFields = ExpenseSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return { message: "Validation failed: " + validatedFields.error.errors[0].message };
        }

        const data = validatedFields.data;

        await prisma.expense.create({
            data: {
                title: data.title,
                amount: data.amount,
                category: data.category || null,
                notes: data.notes || null,
                date: data.date ? new Date(data.date) : new Date(),
                createdById: session?.user?.id || null,
            },
        });

        await logActivity("CREATE_EXPENSE", `Added expense: ${data.title}`);
        revalidatePath("/sales");
        return { message: "Expense added successfully!" };
    } catch (e) {
        console.error(e);
        return { message: "Failed to add expense." };
    }
}

export async function getMonthlyFinancials(month?: number, year?: number) {
    try {
        const now = new Date();
        const targetMonth = month ?? now.getMonth();
        const targetYear = year ?? now.getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const [sales, expenses] = await Promise.all([
            prisma.sale.findMany({
                where: { createdAt: { gte: startDate, lte: endDate } }
            }),
            prisma.expense.findMany({
                where: { date: { gte: startDate, lte: endDate } }
            })
        ]);

        const totalSales = sales.reduce((sum: number, s: any) => sum + s.totalAmount, 0);
        const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);

        return {
            totalSales,
            totalExpenses,
            netIncome: totalSales - totalExpenses,
            salesCount: sales.length,
            menCount: sales.filter((s: any) => s.gender === 'Male').length,
            womenCount: sales.filter((s: any) => s.gender === 'Female').length,
            cashTotal: sales.reduce((sum: number, s: any) => sum + s.cashAmount, 0),
            networkTotal: sales.reduce((sum: number, s: any) => sum + s.networkAmount, 0),
        };
    } catch (e) {
        console.error(e);
        return { totalSales: 0, totalExpenses: 0, netIncome: 0, salesCount: 0, menCount: 0, womenCount: 0, cashTotal: 0, networkTotal: 0 };
    }
}

export async function getUnifiedAnalytics() {
    try {
        const now = new Date();

        // 1. Daily (Current Day)
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        // 2. Weekly (Last 7 Days)
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        // 3. Monthly (Current Calendar Month)
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const [dailySales, weeklySales, monthlySales, monthlyExpenses] = await Promise.all([
            prisma.sale.findMany({ where: { createdAt: { gte: startOfToday, lte: endOfToday } } }),
            prisma.sale.findMany({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.sale.findMany({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
            prisma.expense.findMany({ where: { date: { gte: startOfMonth, lte: endOfMonth } } })
        ]);

        const dailyRevenue = dailySales.reduce((sum, s) => sum + s.totalAmount, 0);
        const weeklyRevenue = weeklySales.reduce((sum, s) => sum + s.totalAmount, 0);
        const monthlyRevenue = monthlySales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

        return {
            daily: dailyRevenue,
            weekly: weeklyRevenue,
            monthly: monthlyRevenue,
            expenses: totalExpenses,
            net: monthlyRevenue - totalExpenses,
            salesCount: monthlySales.length,
            todayCount: dailySales.length
        };
    } catch (e) {
        console.error("Failed to fetch unified analytics:", e);
        return { daily: 0, weekly: 0, monthly: 0, expenses: 0, net: 0, salesCount: 0, todayCount: 0 };
    }
}
