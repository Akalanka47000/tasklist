import type { Request } from 'express';
import { default as context } from 'express-http-context';
import { asyncHandler } from '@sliit-foss/functions';
import * as repository from '../../../repository';
import { forbiddenRouteError } from '@/middleware';
import { ctxTask } from '@/modules/tasks/constants';
import { errors } from '@/modules/tasks/utils';

/**
 * @description Checks if the task being accessed is created by the user and restricts access otherwise.
 */
export const requireSelf = asyncHandler(async (req: Request) => {
    const include = new Set(['dependencies']);
    (req.query.include as string)?.split(',').forEach((i) => {
        include.add(i);
    });
    const task = await repository.getTaskById(req.params.id, Array.from(include));
    if (!task) throw errors.task_not_found;
    if (task.user.toString() !== req.user?._id) throw forbiddenRouteError;
    context.set(ctxTask, task);
});