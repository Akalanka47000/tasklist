import express, { Request, Response } from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { Segments, zelebrateStack } from '@sliit-foss/zelebrate';
import { protect, toSuccess } from '@/middleware';
import { clearTokenCookies, setTokenCookies } from '../../utils/cookie';
import { loginSchema, registerSchema } from './schema';
import * as service from './service';

const auth = express.Router();

auth.post(
  '/login',
  zelebrateStack({ [Segments.BODY]: loginSchema })(
    tracedAsyncHandler(async function login(req, res) {
      const { user, access_token, refresh_token } = await service.login(req.body);
      setTokenCookies(res, access_token, refresh_token);
      return toSuccess({ res, data: user, message: 'Login successfull!' });
    })
  )
);

auth.post(
  '/register',
  zelebrateStack({ [Segments.BODY]: registerSchema })(
    tracedAsyncHandler(async function register(req, res) {
      const { user, access_token, refresh_token } = await service.register(req.body, req.user);
      setTokenCookies(res, access_token, refresh_token);
      return toSuccess({
        res,
        data: user,
        message: 'Registration successfull!'
      });
    })
  )
);

auth.get(
  '/current',
  protect,
  tracedAsyncHandler(function getAuthUser(req, res) {
    delete req.user?.password;
    return toSuccess({ res, data: req.user, message: 'Auth user fetched successfully!' });
  })
);

auth.post(
  '/logout',
  protect,
  tracedAsyncHandler(async function logout(req: Request, res: Response) {
    await service.logout(req.cookies.access_token);
    clearTokenCookies(res);
    return toSuccess({ res, message: 'Logged out successfully!' });
  })
);

export default auth;
