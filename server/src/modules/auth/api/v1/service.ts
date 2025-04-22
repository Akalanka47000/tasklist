import { default as bcrypt } from 'bcryptjs';
import { Blacklist, errors, generateTokens } from '@/modules/auth/utils';
import { createUser, updateUserById } from '@/modules/users/api/v1/service';
import { getUserByEmail } from '@/modules/users/repository';

export const login = async ({ email, password }: Pick<IUser, 'email' | 'password'>) => {
  const user = await getUserByEmail(email!);
  if (!user) throw errors.invalid_credentials;
  if (!user.password || !bcrypt.compareSync(password!, user.password)) {
    throw errors.invalid_credentials;
  }
  updateUserById(user._id, { last_login_time: new Date().toISOString() });
  return {
    user,
    ...generateTokens(user)
  };
};

export const register = (user: Partial<IUser>, existingUser?: IUser) => {
  const next = (user: IUser) => {
    return {
      user,
      ...generateTokens(user)
    };
  };
  if (existingUser) {
    return updateUserById(existingUser._id, user).then(next);
  }
  return createUser(user).then(next);
};

export const logout = (token: string) => {
  return Blacklist.add(token);
};
