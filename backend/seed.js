import prisma from './src/config/prisma.js';
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
      where: { email: 'admin@shoahomes.com' },
      update: {},
      create: {
        email: 'admin@shoahomes.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
      },
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@shoahomes.com' },
      update: {},
      create: {
        email: 'user@shoahomes.com',
        password: userPassword,
        name: 'Regular User',
        role: 'USER',
      },
    });

    console.log('Seeded users:', { admin: admin.email, user: user.email });
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
