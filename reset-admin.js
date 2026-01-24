const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Using a simple password '123'
    const hashedPassword = await bcrypt.hash('123', 10);

    // Update or create the admin user
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: hashedPassword,
        },
        create: {
            username: 'admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('Admin password reset successfully');
    console.log('Username:', admin.username);
    console.log('Password: 123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
