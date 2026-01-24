const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'demo_admin' },
        update: {
            password: hashedPassword,
        },
        create: {
            username: 'demo_admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log('✅ Password reset successfully!');
    console.log('Username:', admin.username);
    console.log('Password: admin123');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
