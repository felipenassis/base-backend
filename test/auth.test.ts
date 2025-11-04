import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/database/prisma';

describe('Auth flow', () => {
  it('should login and return tokens', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('should refresh access token', async () => {
    const login = await request(app).post('/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    const refresh = await request(app).post('/auth/refresh').send({ refreshToken: login.body.refreshToken });
    expect(refresh.status).toBe(200);
    expect(refresh.body).toHaveProperty('accessToken');
  });

  it('should logout (invalidate refresh token)', async () => {
    const login = await request(app).post('/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    const logout = await request(app).post('/auth/logout').send({ refreshToken: login.body.refreshToken });
    expect(logout.status).toBe(200);
    // try refresh should fail
    const refresh = await request(app).post('/auth/refresh').send({ refreshToken: login.body.refreshToken });
    expect(refresh.status).toBe(401);
  });
});
