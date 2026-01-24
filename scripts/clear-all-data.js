const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting data cleanup...');

    // Delete ActivityLog first (it might have relations, though none are defined in the schema)
    const deletedActivity = await prisma.activityLog.deleteMany({});
    console.log(`Deleted ${deletedActivity.count} activity logs.`);

    // Delete Patients
    const deletedPatients = await prisma.patient.deleteMany({});
    console.log(`Deleted ${deletedPatients.count} patients.`);

    // Delete Employees
    const deletedEmployees = await prisma.employee.deleteMany({});
    console.log(`Deleted ${deletedEmployees.count} employees.`);

    console.log('Data cleanup completed successfully. Users (Admins) were preserved.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
