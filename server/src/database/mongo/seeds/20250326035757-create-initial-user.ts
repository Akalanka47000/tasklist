import { default as bcrypt } from 'bcryptjs';

const email = 'hello@tasklist.io';
const password = 'Axcvu8@14c';

export const up = async (db) => {
  await db.collection('users').insertOne({
    name: 'Test User',
    email,
    password: bcrypt.hashSync(password, process.env.SALT_ROUNDS),
    created_at: new Date(),
    updated_at: new Date()
  });
};

export const down = async (db) => {
  await db.collection('users').deleteOne({
    email
  });
};
