import { regex } from '@shared/constants';
import { z } from '@sliit-foss/zelebrate';

export const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().regex(regex.password, {
    message: `Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long`
  })
});

export const updateUserSchema = createUserSchema.partial();
