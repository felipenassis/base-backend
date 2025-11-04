import { execSync } from 'child_process';
import { prisma } from '../src/database/prisma';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Run Prisma db push to sync schema
beforeAll(async () => {
  console.log('🔧 Sincronizando schema com Prisma (db push)...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  // Clean up test.db if running test:ci
  if (process.env.DATABASE_URL?.includes('test.db')) {
    try { fs.unlinkSync('test.db'); console.log('🧹 test.db removido.'); } catch {}
  }
});

beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();

  const adminRole = await prisma.role.create({ data: { name: 'admin', permissions: { create: [{ action: 'users.read' }, { action: 'users.create' }] } } });
  const userRole = await prisma.role.create({ data: { name: 'user', permissions: { create: [{ action: 'profile.read' }] } } });
  const bcrypt = require('bcryptjs');
  const password = await bcrypt.hash('admin123', 8);
  await prisma.user.create({ data: { name: 'Admin', email: 'admin@example.com', password, roleId: adminRole.id } });
});
