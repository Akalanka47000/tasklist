import { moduleLogger } from '@sliit-foss/module-logger';
import { default as jwt } from 'jsonwebtoken';
import { default as config } from '@/config';
import { errors } from './errors';

const logger = moduleLogger('Jwt-util');

export const verify = (token: string, ignoreExpiry: boolean = false) => {
  try {
    const verificationMethod: Function = ignoreExpiry ? jwt.decode : jwt.verify;
    return verificationMethod(token, config.JWT_SECRET);
  } catch (error) {
    logger.error(`Jwt verification failed - ${error.message}`);
    if (error.message === 'jwt expired') {
      throw errors.token_expired;
    }
    throw errors.invalid_token;
  }
};

export const generateTokens = (user: IUser) => {
  delete user.password;
  const accessToken = jwt.sign(JSON.parse(JSON.stringify(user)), config.JWT_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY
  });
  const refreshToken = jwt.sign(
    {
      access_token: accessToken
    },
    config.JWT_SECRET,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRY
    }
  );
  return { access_token: accessToken, refresh_token: refreshToken };
};
