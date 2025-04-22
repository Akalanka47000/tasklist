import { z } from '@sliit-foss/zelebrate';
import { loginSchema, registerSchema } from '.';

declare module 'server' {
  namespace Auth {
    namespace V1 {
      export type ILoginRequest = z.infer<typeof loginSchema>;
      export type IRegisterRequest = z.infer<typeof registerSchema>;
    }
  }
}
