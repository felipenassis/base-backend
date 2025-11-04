import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database/prisma';

describe('Permissions', () => {
  it('non-admin cannot create users', async () => {
    // create a non-admin user directly via prisma
    const role = await prisma.role.findUnique({ where: { name: 'user' } });
    const bcrypt = require('bcryptjs');
    const hashed = await bcrypt.hash('userpass', 8);
    const u = await prisma.user.create({ data: { name: 'Normal', email: 'normal@example.com', password: hashed, roleId: role!.id } });

    // login as this user
    const login = await request(app).post('/auth/login').send({ email: 'normal@example.com', password: 'userpass' });
    const token = login.body.accessToken;
    // attempt to create user
    const res = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send({ name: 'X', email: 'x@example.com', password: '123', role: 'user' });
    expect(res.status).toBe(403);
  });
});
