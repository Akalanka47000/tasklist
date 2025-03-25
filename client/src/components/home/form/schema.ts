import { Priority, RecurringInterval, TaskStatus } from '@shared/constants';
import { z } from 'zod';

export const FormSchema = z.object({
  title: z.string(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus).optional(),
  recurring_interval: z.nativeEnum(RecurringInterval).optional(),
  dependencies: z.array(z.string()).optional()
});
