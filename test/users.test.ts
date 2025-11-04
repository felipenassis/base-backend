import request from 'supertest';
import app from '../src/app';

describe('Users endpoints', () => {
  it('admin can create and list users', async () => {
    const login = await request(app).post('/auth/login').send({ email: 'admin@example.com', password: 'admin123' });
    const token = login.body.accessToken;
    const create = await request(app).post('/users').set('Authorization', `Bearer ${token}`).send({ name: 'User1', email: 'user1@example.com', password: 'pass123', role: 'user' });
    expect(create.status).toBe(201);
    const list = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });

  it('cannot create without token', async () => {
    const res = await request(app).post('/users').send({ name: 'User2', email: 'user2@example.com', password: '123456', role: 'user' });
    expect(res.status).toBe(401);
  });
});
