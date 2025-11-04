import { prisma } from '../../database/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env';
import crypto from 'crypto';

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email }, include: { role: { include: { permissions: true } } } });
  if (!user) throw new Error('Credenciais inválidas');
  const same = await bcrypt.compare(password, user.password);
  if (!same) throw new Error('Credenciais inválidas');

  const permissions = user.role.permissions.map(p=>p.action);
  const accessToken = jwt.sign({ id: user.id, role: user.role.name, permissions }, JWT_SECRET, { expiresIn: '15m' });
  const refreshValue = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { token: refreshValue, userId: user.id, expiresAt } });
  return { accessToken, refreshToken: refreshValue, user: { id: user.id, email: user.email, role: user.role.name } };
}

export async function refreshToken(old: string) {
  const ref = await prisma.refreshToken.findUnique({ where: { token: old } });
  if (!ref || ref.expiresAt < new Date()) throw new Error('Token inválido');
  const user = await prisma.user.findUnique({ where: { id: ref.userId }, include: { role: { include: { permissions: true } } } });
  if (!user) throw new Error('Usuário não encontrado');
  const permissions = user.role.permissions.map(p=>p.action);
  const newAccess = jwt.sign({ id: user.id, role: user.role.name, permissions }, JWT_SECRET, { expiresIn: '15m' });
  return { accessToken: newAccess };
}

export async function logout(token: string) {
  await prisma.refreshToken.deleteMany({ where: { token } });
  return { message: 'Logout efetuado' };
}
