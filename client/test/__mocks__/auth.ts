import { faker } from '@faker-js/faker';

export const mockUser = {
  _id: faker.string.hexadecimal({ length: 24, prefix: '' }),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.past().toISOString()
} as IUser;

export const mockCurrentUserResponse = {
  data: mockUser,
  message: 'Auth user fetched successfully!'
};
