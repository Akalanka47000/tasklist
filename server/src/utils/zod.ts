import { z } from '@sliit-foss/zelebrate';

z.objectId = () => z.string().regex(/^[0-9a-f]{24}$/);

/**
 * @description Creates and returns a Zod schema for validating pagination query parameters
 */
export const getAllSchema = () => {
  return z
    .object({
      page: z.coerce.number().int().min(1),
      limit: z.coerce.number().int().min(1).max(100).default(10)
    })
    .catchall(z.unknown());
};

/**
 * @description Creates and returns a Zod schema for validating object ids in the request params
 * @param name - The name of the id field. Defaults to 'id'
 * @example
 * objectIdSchema('userId');
 */
export const objectIdSchema = (name: string = 'id') =>
  z.object({
    [name]: z.objectId()
  });
