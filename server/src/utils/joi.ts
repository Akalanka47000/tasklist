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

/**
 * @description Creates and returns a Joi schema for validating pagination query parameters
 */
export const getAllSchema = () => {
  return Joi.object({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).max(100).default(10)
  }).unknown();
};

/**
 * @description Creates and returns a Joi schema for validating object ids in the request params
 * @param name - The name of the id field. Defaults to 'id'
 * @example
 * objectIdSchema('userId');
 */
export const objectIdSchema = (name: string = 'id') =>
  Joi.object({
    [name]: Joi.objectId().required()
  });
