import express, { Request, Response } from 'express';
import { traced, tracedAsyncHandler } from '@sliit-foss/functions';
import { default as filterQuery } from '@sliit-foss/mongoose-filter-query';
import { celebrate, Segments } from 'celebrate';
import { cache, protect, toSuccess } from '@/middleware';
import { getAllSchema, objectIdSchema } from '@/utils';
import { createTaskSchema, updateTaskSchema } from './schema';
import * as service from './service';
import { requireSelf } from './middleware';
import { generateTokens, setTokenCookies } from '@/modules/auth/utils';
import { createUser as createGuestUser } from '@/modules/users/repository';

const task = express.Router();

task.post(
  '/',
  protect,
  celebrate({ [Segments.BODY]: createTaskSchema }),
  tracedAsyncHandler(async function createTask(req: Request, res: Response) {
    req.body.user = req.user?._id;
    const data = await service.createTask(req.body);
    return toSuccess({ res, data, message: 'Task created successfully!' });
  })
);

task.get(
  '/',
  celebrate({ [Segments.QUERY]: getAllSchema() }, {}, { reqContext: true }),
  filterQuery,
  tracedAsyncHandler(async function getTasks(req: Request, res: Response) {
    if (!req.user) {
      req.user = await traced(createGuestUser)()
      const tokens = generateTokens(req.user)
      setTokenCookies(res, tokens.access_token, tokens.refresh_token);
    }
    const data = await service.getTasks(req.query, req.user);
    return toSuccess({ res, data, message: 'Tasks fetched successfully!' });
  })
);

task.get(
  '/:id',
  protect,
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  requireSelf,
  tracedAsyncHandler(async function getTaskById(req: Request, res: Response) {
    req.apicacheGroup = req.params.id;
    const data = await service.getTaskById(req.params.id);
    return toSuccess({ res, data, message: 'Task fetched successfully!' });
  })
);

task.patch(
  '/:id',
  protect,
  celebrate({ [Segments.PARAMS]: objectIdSchema(), [Segments.BODY]: updateTaskSchema }),
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
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  requireSelf,
  tracedAsyncHandler(async function deleteTaskById(req: Request, res: Response) {
    await service.deleteTaskById(req.params.id);
    return toSuccess({ res, message: 'Task deleted successfully!' });
  })
);

export default task;
