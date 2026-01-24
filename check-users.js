const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany();
    console.log('Users in DB:');
    users.forEach(u => {
        console.log(`  - Username: ${u.username}, Role: ${u.role}`);
    });
    await prisma.$disconnect();
}

check();
