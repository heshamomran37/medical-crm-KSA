const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addSamplePatients() {
    // Add sample patients with WhatsApp numbers
    const patients = [
        {
            name: "Ahmed Mohamed",
            type: "Individual",
            phone: "+20 123 456 7890",
            whatsapp: "201234567890",
            email: "ahmed@example.com",
            address: "Cairo, Egypt",
            status: "New",
            followUpStatus: "First consultation scheduled"
        },
        {
            name: "Fatima Ali",
            type: "Individual",
            phone: "+20 111 222 3333",
            whatsapp: "201112223333",
            email: "fatima@example.com",
            address: "Alexandria, Egypt",
            status: "Admitted",
            followUpStatus: "Weekly checkup required"
        },
        {
            name: "Cairo Medical Center",
            type: "Company",
            phone: "+20 100 200 3000",
            whatsapp: "201002003000",
            email: "info@cairomedical.com",
            address: "Downtown Cairo, Egypt",
            status: "Admitted"
        }
    ];

    for (const patient of patients) {
        await prisma.patient.create({
            data: patient
        });
    }

    console.log('✅ Sample patients added successfully!');
    console.log('📱 All patients have WhatsApp numbers for direct contact');
}

addSamplePatients()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
