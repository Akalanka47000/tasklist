import { traced } from '@sliit-foss/functions';
import { RetrievalOptions } from 'mongoose';
import * as repository from '../../repository';
import { hashPasswordIfProvided } from './helpers';

const layer = 'repository';

export const createUser = async (user: Partial<IUser>) => {
  await hashPasswordIfProvided(user);
  user.email &&= user.email.toLowerCase();
  return traced[layer](repository.createUser)(user);
};

export const getUsers = (retrievalOptions: RetrievalOptions) => {
  return traced[layer](repository.getAllUsers)(retrievalOptions);
};

export const getUserById = (id: string) => repository.getUserById(id);

export const updateUserById = async (id: string, data: Partial<IUser>) => {
  await hashPasswordIfProvided(data);
  data.email &&= data.email.toLowerCase();
  return traced[layer](repository.updateUserById)(id, data);
};

export const deleteUserById = (id: string) => {
  return traced[layer](repository.deleteUserById)(id);
};
