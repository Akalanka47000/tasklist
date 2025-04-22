import { z } from '@sliit-foss/zelebrate';
import { createTaskSchema, updateTaskSchema } from '.';

declare module 'server/api' {
  namespace Tasks {
    namespace V1 {
      export type ICreateTaskRequest = z.infer<typeof createTaskSchema>;
      export type IUpdateTaskRequest = z.infer<typeof updateTaskSchema>;
    }
  }
}
