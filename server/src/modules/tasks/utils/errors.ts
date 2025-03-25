import createError from 'http-errors';

export const errors = {
  task_not_found: createError(404, 'Task not found')
};
