import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';
import { Joi } from 'celebrate';
import { optionalSchema } from '@/utils';

export const createTaskSchema = Joi.object({
  title: Joi.string().required(),
  priority: Joi.number()
    .valid(...Object.values(Priority))
    .required(),
  recurring_interval: Joi.string().valid(...Object.values(RecurringInterval)),
  dependencies: Joi.array().items(Joi.objectId())
});

export const updateTaskSchema = optionalSchema(createTaskSchema).keys({
  status: Joi.string().valid(...Object.values(TaskStatus))
});
