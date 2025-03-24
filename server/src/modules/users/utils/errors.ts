import createError from 'http-errors';

export const errors = {
  user_not_found: createError(404, 'User not found')
};
