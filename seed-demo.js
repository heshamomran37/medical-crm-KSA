const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed process...');

    // Clear existing data (optional, but good for a clean demo)
    await prisma.activityLog.deleteMany({});
    await prisma.patient.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.user.deleteMany({});

    // Create Admin Account
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const admin = await prisma.user.create({
        data: {
            username: 'demo_admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin created.');

    // Create Elite Medical Staff
    const employees = await prisma.employee.createMany({
        data: [
            {
                name: 'د. عبدالملك القحطاني',
                role: 'طبيب استشاري',
                department: 'الجلدية',
                status: 'Active',
                phone: '0501234567',
                username: 'dr_abdulmalik',
                password: hashedPassword,
            },
            {
                name: 'د. نورة السبيعي',
                role: 'طبيب نائب',
                department: 'الأسنان',
                status: 'Active',
                phone: '0502345678',
                username: 'dr_noura',
                password: hashedPassword,
            },
            {
                name: 'سارة العتيبي',
                role: 'موظف استقبال',
                department: 'الإدارة',
                status: 'Active',
                phone: '0503456789',
                username: 'sara_admin',
                password: hashedPassword,
            },
        ],
    });

    console.log('Employees created.');

    // Create Patients with Saudi Identities
    await prisma.patient.createMany({
        data: [
            {
                name: 'بندر الشمري',
                phone: '0551112223',
                whatsapp: '966551112223',
                status: 'Under Treatment',
                type: 'Individual',
                gender: 'Male',
                address: 'الرياض - حي الملز',
                createdById: admin.id,
            },
            {
                name: 'لمياء الغامدي',
                phone: '0562223334',
                whatsapp: '966562223334',
                status: 'Recovered',
                type: 'Individual',
                gender: 'Female',
                address: 'جولة - حي العليا',
                createdById: admin.id,
            },
            {
                name: 'فيصل بن خالد',
                phone: '0543334445',
                whatsapp: '966543334445',
                status: 'New',
                type: 'Individual',
                gender: 'Male',
                address: 'الدمام - حي الشاطئ',
                createdById: admin.id,
            },
            {
                name: 'شركة أرامكو السعودية',
                phone: '0138720110',
                status: 'Active',
                type: 'Company',
                address: 'الظهران',
                createdById: admin.id,
            },
        ],
    });

    console.log('Patients created.');

    // Create Activity Logs for a "live" feel
    await prisma.activityLog.createMany({
        data: [
            { action: 'LOGIN', description: 'مسؤول النظام قام بتسجيل الدخول', userId: admin.id },
            { action: 'CREATE_PATIENT', description: 'تم إضافة المريض بندر الشمري بنجاح', userId: admin.id },
            { action: 'CREATE_EMPLOYEE', description: 'تم تسجيل د. عبدالملك القحطاني كطبيب استشاري', userId: admin.id },
            { action: 'SYSTEM_UPDATE', description: 'تحديث قواعد البيانات لعام 2026', userId: admin.id },
        ],
    });

    console.log('Activity logs created.');
    console.log('Seed process completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
