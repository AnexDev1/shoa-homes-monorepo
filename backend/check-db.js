import { PrismaClient } from '@prisma/client';

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    const properties = await prisma.property.findMany();
    console.log('Properties found:', properties.length);
    properties.forEach((p) => console.log(`- ${p.title}`));

    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    users.forEach((u) => console.log(`- ${u.email} (${u.role})`));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
