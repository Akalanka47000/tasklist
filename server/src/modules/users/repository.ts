import { default as mongoose } from 'mongoose';
import { scrubbable, User } from './api/v1/models';

export const createUser = (user: Partial<IUser> = {}): Promise<IUser> => {
  user.email &&= user.email.toLowerCase();
  return User.create(user).then((u) => u.cleanse());
};

export const getUserByEmail = (email: string): Promise<IUser> => {
  return User.findOne({ email }).lean();
};

export const getUserById = (id: string, plain = false): Promise<IUser> => {
  if (plain) return User.findById(id).lean();
  return User.findById(id).select(scrubbable).lean();
};

export const getUserBy = (filters = {}): Promise<IUser> => {
  return User.findOne(filters).lean();
};

export const getAllUsers = ({ page, limit, ...options }: mongoose.RetrievalOptions) => {
  const pipeline = User.aggregate(User.aggregateUtils.retrieve({ ...options, select: options.select ?? scrubbable }));
  if (page && limit) {
    return User.aggregatePaginate(pipeline, { page, limit });
  }
  return pipeline;
};

export const updateUserById = (id: string, data: Partial<IUser>): Promise<IUser> => {
  data.email &&= data.email.toLowerCase();
  return User.findByIdAndUpdate(id, data, { new: true }).select(scrubbable).lean();
};

export const deleteUserById = (id: string) => {
  return User.findOneAndDelete({ _id: id }).lean();
};
