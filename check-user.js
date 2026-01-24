const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const user = await prisma.user.findUnique({
        where: { username: 'admin' }
    });
    console.log('User found:', user);
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
