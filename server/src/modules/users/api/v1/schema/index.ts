import { passwordValidationFailureMessage, regex } from '@shared/constants';
import { z } from '@sliit-foss/zelebrate';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().regex(regex.password, {
    message: passwordValidationFailureMessage
  })
});

export const updateUserSchema = createUserSchema.partial();
