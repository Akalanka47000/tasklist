import { z } from '@sliit-foss/zelebrate';
import { createUserSchema, updateUserSchema } from '.';

declare module 'server' {
  namespace Users {
    namespace V1 {
      export type ICreateUserRequest = z.infer<typeof createUserSchema>;
      export type IUpdateUserRequest = z.infer<typeof updateUserSchema>;
    }
  }
}
