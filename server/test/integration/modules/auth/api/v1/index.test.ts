import { default as request } from 'supertest';
import { app } from '@/app';
import { faker } from '@faker-js/faker';
import { closeConnections } from '../../../../teardown';

afterAll(closeConnections);

describe('authentication', () => {
  describe('register', () => {
    test('should throw validation error because name is missing', async (done) => {
      const res = await request(app).post('/api/v1/auth/register').send({
        email: faker.internet.email(),
        password: faker.internet.password()
      });
      expect(res.status).toBe(422);
      expect(res.body.message).toContain('"name" is required');
      done();
    });
  });
});
