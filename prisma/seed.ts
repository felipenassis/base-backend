import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      permissions: { create: [{ action: 'users.read' }, { action: 'users.create' }, { action: 'users.delete' }] }
    }
  });
  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: { name: 'user', permissions: { create: [{ action: 'profile.read' }] } }
  });
  const password = await bcrypt.hash('admin123', 8);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', password, roleId: adminRole.id }
  });
  console.log('✅ Seed criado com admin@example.com / admin123');
}
main().finally(() => prisma.$disconnect());
