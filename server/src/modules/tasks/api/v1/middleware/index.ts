import type { Request } from 'express';
import { default as context } from 'express-http-context';
import { asyncHandler } from '@sliit-foss/functions';
import { forbiddenRouteError } from '@/middleware';
import { ctxTask } from '@/modules/tasks/constants';
import { errors } from '@/modules/tasks/utils';
import { getTaskById } from '../service';

/**
 * @description Checks if the task being accessed is created by the user and restricts access otherwise.
 */
export const requireSelf = asyncHandler(async (req: Request) => {
  const task = await getTaskById(req.params.id, req.query.include as string);
  if (!task) throw errors.task_not_found;
  if (
    task.user.toString() !== req.user._id.toString() &&
    (task.user as IUser)._id?.toString() !== req.user._id.toString()
  )
    throw forbiddenRouteError;
  context.set(ctxTask, task);
});
