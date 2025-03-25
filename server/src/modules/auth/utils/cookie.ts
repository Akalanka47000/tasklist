import { Response } from 'express';

export const setCookie = (res: Response, name: string, value: string, expiry: number = 1) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiry * 60 * 60 * 1000
  });
};

export const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  setCookie(res, 'access_token', accessToken, 1);
  setCookie(res, 'refresh_token', refreshToken, 24 * 30);
};

export const clearTokenCookies = (res: Response) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
};
