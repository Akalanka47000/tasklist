import { default as request } from 'supertest';
import { app } from '@/app';
import { faker } from '@faker-js/faker';
import { mockUser } from '../../../../../__mocks__';
import { sessionCookie } from '../../../../../__utils__';
import { closeConnections } from '../../../../teardown';

afterAll(closeConnections);

describe('authentication', () => {
  describe('register', () => {
    test('should throw validation error because name is missing', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: faker.internet.email(),
        password: faker.internet.password()
      });
      expect(res.status).toBe(422);
      expect(res.body.message).toContain('"name" is required');
    });
    test('should successfully register', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(mockUser);
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(mockUser.email);
      expect(res.body.data.password).toBeUndefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token');
      expect(res.headers['set-cookie'][1]).toContain('refresh_token');
    });
    test('should fail to register since email is already taken', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(mockUser);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('The email you entered is already taken');
    });
    test('should successfully login', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: mockUser.email,
        password: mockUser.password
      });
      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(mockUser.email);
      expect(res.body.data.password).toBeUndefined();
      expect(res.headers['set-cookie'][0]).toContain('access_token');
      expect(res.headers['set-cookie'][1]).toContain('refresh_token');
    });
    test('should successfully logout', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Cookie', await sessionCookie(app));
      expect(res.status).toBe(200);
    });
  });
});
