import { Joi } from 'celebrate';
import { ObjectSchema, Schema } from 'joi';

Joi.objectId = () => Joi.string().hex().length(24);

/**
 * @description Converts all keys of a given Joi schema to optional
 * @param schema - The Joi schema
 * @returns The Joi schema with all keys optional
 */
export const optionalSchema = (schema: ObjectSchema) =>
  schema.fork(Object.keys(schema.describe().keys), (schema: Schema) => schema.optional());

export const idSchema = Joi.object({
  id: Joi.string().required()
});
