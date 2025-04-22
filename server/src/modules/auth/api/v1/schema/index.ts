import { passwordValidationFailureMessage, regex } from '@shared/constants';
import { z } from '@sliit-foss/zelebrate';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const registerSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().regex(regex.password, {
    message: passwordValidationFailureMessage
  })
});
