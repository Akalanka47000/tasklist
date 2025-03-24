import { regex } from '@shared/constants';
import bcrypt from 'bcryptjs';
import config from '@/config';

export const hashPasswordIfProvided = async (user: Partial<IUser>) => {
  if (user.password && !user.password.match(regex.hash))
    user.password = await bcrypt.hash(user.password, config.SALT_ROUNDS); // If password is not already hashed, hash it
  return user;
};
