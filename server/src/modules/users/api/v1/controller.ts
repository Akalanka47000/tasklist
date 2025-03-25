import express, { Request, Response } from 'express';
import { tracedAsyncHandler } from '@sliit-foss/functions';
import { default as filterQuery } from '@sliit-foss/mongoose-filter-query';
import { celebrate, Segments } from 'celebrate';
import { cache, cacheSuccess, internal, toSuccess } from '@/middleware';
import { getAllSchema, objectIdSchema } from '@/utils';
import { errors } from '../../utils';
import { createUserSchema, updateUserSchema } from './schema';
import * as service from './service';

const user = express.Router();

user.post(
  '/',
  internal,
  celebrate({ [Segments.BODY]: createUserSchema }),
  tracedAsyncHandler(async function createUser(req: Request, res: Response) {
    const data = await service.createUser(req.body);
    return toSuccess({ res, data, message: 'User created successfully!' });
  })
);

user.get(
  '/',
  internal,
  celebrate({ [Segments.QUERY]: getAllSchema() }, {}, { reqContext: true }),
  filterQuery,
  tracedAsyncHandler(async function getUsers(req: Request, res: Response) {
    const data = await service.getUsers(req.query);
    return toSuccess({ res, data, message: 'Users fetched successfully!' });
  })
);

user.get(
  '/:id',
  internal,
  cacheSuccess('30 seconds'),
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  tracedAsyncHandler(async function getUserById(req: Request, res: Response) {
    req.apicacheGroup = req.params.id;
    const data = await service.getUserById(req.params.id);
    if (!data) throw errors.user_not_found;
    return toSuccess({ res, data, message: 'User fetched successfully!' });
  })
);

user.patch(
  '/:id',
  internal,
  celebrate({ [Segments.PARAMS]: objectIdSchema(), [Segments.BODY]: updateUserSchema }),
  tracedAsyncHandler(async function updateUserById(req: Request, res: Response) {
    const data = await service.updateUserById(req.params.id, req.body);
    if (!data) throw errors.user_not_found;
    cache.clear(req.params.id);
    return toSuccess({ res, data, message: 'User updated successfully!' });
  })
);

user.delete(
  '/:id',
  internal,
  celebrate({ [Segments.PARAMS]: objectIdSchema() }),
  tracedAsyncHandler(async function deleteUserById(req: Request, res: Response) {
    const deletedUser = await service.deleteUserById(req.params.id);
    if (!deletedUser) throw errors.user_not_found;
    return toSuccess({ res, message: 'User deleted successfully!' });
  })
);

export default user;
