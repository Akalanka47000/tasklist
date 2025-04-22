import express, { Request, Response } from 'express';
import { default as context } from '@sliit-foss/express-http-context';
import { traced, tracedAsyncHandler } from '@sliit-foss/functions';
import { default as filterQuery } from '@sliit-foss/mongoose-filter-query';
import { Segments, zelebrate } from '@sliit-foss/zelebrate';
import { cache, protect, toSuccess } from '@/middleware';
import { generateTokens, setTokenCookies } from '@/modules/auth/utils';
import { createUser as createGuestUser } from '@/modules/users/repository';
import { getAllSchema, objectIdSchema } from '@/utils';
import { ctxTask } from '../../constants';
import { requireSelf } from './middleware';
import { createTaskSchema, updateTaskSchema } from './schema';
import * as service from './service';

const task = express.Router();

task.post(
  '/',
  protect,
  zelebrate({ [Segments.BODY]: createTaskSchema }),
  tracedAsyncHandler(async function createTask(req: Request, res: Response) {
    req.body.user = req.user?._id;
    const data = await service.createTask(req.body);
    return toSuccess({ res, data, message: 'Task created successfully!' });
  })
);

task.get(
  '/',
  zelebrate({ [Segments.QUERY]: getAllSchema() }, {}),
  filterQuery,
  tracedAsyncHandler(async function getTasks(req: Request, res: Response) {
    if (!req.user) {
      req.user = await traced(createGuestUser)();
      const tokens = generateTokens(req.user);
      setTokenCookies(res, tokens.access_token, tokens.refresh_token);
    }
    const data = await service.getTasks(req.query, req.user);
    return toSuccess({ res, data, message: 'Tasks fetched successfully!' });
  })
);

task.get(
  '/:id',
  protect,
  zelebrate({ [Segments.PARAMS]: objectIdSchema() }),
  requireSelf,
  tracedAsyncHandler(function getTaskById(req: Request, res: Response) {
    req.apicacheGroup = req.params.id;
    const existingTask: IDetailedTask = context.get(ctxTask);
    return toSuccess({ res, data: existingTask, message: 'Task fetched successfully!' });
  })
);

task.patch(
  '/:id',
  protect,
  zelebrate({ [Segments.PARAMS]: objectIdSchema(), [Segments.BODY]: updateTaskSchema }),
  requireSelf,
  tracedAsyncHandler(async function updateTaskById(req: Request, res: Response) {
    const data = await service.updateTaskById(req.params.id, req.body);
    cache.clear(req.params.id);
    return toSuccess({ res, data, message: 'Task updated successfully!' });
  })
);

task.delete(
  '/:id',
  protect,
  zelebrate({ [Segments.PARAMS]: objectIdSchema() }),
  requireSelf,
  tracedAsyncHandler(async function deleteTaskById(req: Request, res: Response) {
    await service.deleteTaskById(req.params.id);
    return toSuccess({ res, message: 'Task deleted successfully!' });
  })
);

export default task;
