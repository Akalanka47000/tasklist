import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';
import { z } from '@sliit-foss/zelebrate';

export const createTaskSchema = z.object({
  title: z.string(),
  priority: z.nativeEnum(Priority),
  recurring_interval: z.nativeEnum(RecurringInterval).optional(),
  dependencies: z.array(z.objectId()).optional()
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.nativeEnum(TaskStatus).optional()
});
