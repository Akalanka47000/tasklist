import createError from 'http-errors';

export const errors = {
  task_not_found: createError(404, 'Task not found'),
  task_has_dependencies: createError(
    400,
    'Task has dependencies and cannot be deleted. Please delete the dependencies to proceed'
  ),
  dependendant_tasks_not_completed: createError(
    400,
    'Cannot mark a task as completed while the tasks it depends on are not completed'
  )
};
