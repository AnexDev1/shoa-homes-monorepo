#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL || process.argv[2];
const newPass = process.env.ADMIN_PASSWORD || process.argv[3];

if (!email || !newPass) {
  console.error(
    'Usage: ADMIN_EMAIL=you@x.com ADMIN_PASSWORD=newPass node ./scripts/resetAdminPassword.js'
  );
  process.exit(1);
}

(async () => {
  try {
    const hashed = await bcrypt.hash(newPass, 10);
    const result = await prisma.user.updateMany({
      where: { email },
      data: { password: hashed },
    });
    console.log(`${result.count} user(s) updated for ${email}`);
  } catch (error) {
    console.error('Error updating admin password:', error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();
