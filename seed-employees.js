const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding employees...');

    const employees = [
        {
            name: 'Dr. Sarah Smith',
            role: 'Cardiologist',
            status: 'Active',
            email: 'sarah.smith@med.com',
            phone: '+1 555-0101',
            department: 'Cardiology',
            username: 'sarah',
            password: '123'
        },
        {
            name: 'Dr. Ahmed Ali',
            role: 'Pediatrician',
            status: 'On Leave',
            email: 'ahmed.ali@med.com',
            phone: '+20 100-555-999',
            department: 'Pediatrics',
            username: 'ahmed',
            password: '123'
        },
        {
            name: 'Nurse Emily Blunt',
            role: 'Head Nurse',
            status: 'Active',
            email: 'emily@med.com',
            department: 'Nursing',
            username: 'emily',
            password: '123'
        },
        {
            name: 'Dr. House',
            role: 'Diagnostician',
            status: 'In Surgery',
            department: 'Diagnostic Medicine',
        }
    ];

    for (const emp of employees) {
        const exists = await prisma.employee.findFirst({
            where: { name: emp.name }
        });

        if (!exists) {
            await prisma.employee.create({ data: emp });
            console.log(`Created employee: ${emp.name}`);
        } else {
            console.log(`Skipped (already exists): ${emp.name}`);
        }
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
