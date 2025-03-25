import createError from 'http-errors';

export const errors = {
  task_not_found: createError(404, 'Task not found'),
  task_has_dependencies: createError(
    400,
    'Task has dependencies and cannot be deleted. Please delete the dependencies to proceed'
  )
};
