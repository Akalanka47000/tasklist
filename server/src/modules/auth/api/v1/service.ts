import { default as bcrypt } from 'bcryptjs';
import { Blacklist, errors, generateTokens } from '@/modules/auth/utils';
import { createUser, updateUserById } from '@/modules/users/api/v1/service';
import { getUserByEmail } from '@/modules/users/repository';

export const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await getUserByEmail(email, true);
  if (!user) throw errors.invalid_credentials;
  if (!user.password || !bcrypt.compareSync(password, user.password)) {
    throw errors.invalid_credentials;
  }
  updateUserById(user.id, { last_login_time: new Date() });
  return {
    user,
    ...generateTokens(user)
  };
};

export const register = (user: IUser) => {
  return createUser(user).then((user) => {
    return {
      user,
      ...generateTokens(user)
    };
  });
};

export const logout = (token: string) => {
  return Blacklist.add(token);
};
