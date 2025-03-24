import createError from 'http-errors';

export const errors = {
  missing_token: createError(401, 'Bearer token is missing'),
  invalid_token: createError(401, 'Token is invalid'),
  cancelled_token: createError(401, 'Token has been revoked'),
  invalid_credentials: createError(401, 'Invalid credentials'),
  token_expired: createError(401, 'Token has expired'),
  user_already_exists: createError(400, 'User already exists'),
  user_not_found: createError(404, 'User not found')
};
