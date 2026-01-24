const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSampleEmployee() {
    // Add a sample employee with login credentials
    const employee = await prisma.employee.create({
        data: {
            name: "Dr. Sarah Ahmed",
            role: "Doctor",
            email: "sarah@clinic.com",
            phone: "+20 100 111 2222",
            whatsapp: "201001112222",
            address: "Cairo, Egypt",
            department: "Cardiology",
            username: "sarah.ahmed",
            password: "123",
            status: "Active"
        }
    });

    console.log('✅ Sample employee added successfully!');
    console.log('📱 Login credentials:');
    console.log('   Username: sarah.ahmed');
    console.log('   Password: 123');
    console.log('');
    console.log('Employee details:', employee);
}

addSampleEmployee()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
