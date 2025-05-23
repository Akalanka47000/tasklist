import { Express } from 'express';
import { default as request } from 'supertest';
import { mockUser } from '../__mocks__';

const extractCookie = (cookie: string) => {
  return `access_token=${cookie.split('=')[1].split(';')[0]}`;
};

export const sessionCookie = async (app: Express, credentials?: Pick<IUser, 'email' | 'password'>) => {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send(
      credentials || {
        email: mockUser.email,
        password: mockUser.password
      }
    );
  return extractCookie(res.headers['set-cookie'][0]);
};

export const registerUser = async (app: Express) => {
  const res = await request(app).post('/api/v1/auth/register').send(mockUser);
  return extractCookie(res.headers['set-cookie'][0]);
};
