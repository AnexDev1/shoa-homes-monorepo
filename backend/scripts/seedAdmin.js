#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@shoahomes.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'Admin';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    return;
  }

  const hashed = await bcrypt.hash(adminPass, 10);
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashed,
      name: adminName,
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', user.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
