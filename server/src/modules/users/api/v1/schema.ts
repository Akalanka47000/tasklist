import { regex } from '@shared/constants';
import { Joi } from 'celebrate';
import { optionalSchema } from '@/utils';

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(regex.password)
    .error((errors) =>
      errors.map((err) => {
        if (err.code === 'string.pattern.base')
          err.message = `Password should have at least one lowercase letter, one uppercase letter, one number and one special character and should be at least 8 characters long`;
        return err;
      })
    )
});

export const updateUserSchema = optionalSchema(createUserSchema);
