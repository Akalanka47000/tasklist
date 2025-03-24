import { moduleLogger } from '@sliit-foss/module-logger';
import { Joi } from 'celebrate';
import type { Schema } from 'joi';

const logger = moduleLogger('Config');

interface IConfig<T> {
  schema: Record<string, Schema>;
  values: T;
}

/**
 * @description Validates a set of values against the given schema. If validation fails, the process exits with code 1 with an error message.
 * @returns The validated config values
 */
const validate = <T>({ schema, values }: IConfig<T>) => {
  const { error } = Joi.object(schema).validate(values);
  if (error) {
    logger.error(`Environment validation failed. \nDetails - ${error.details[0].message}\nExiting...`);
    process.exit(1);
  }
  return values;
};

export enum Environment {
  Production = 'prod',
  Development = 'dev',
  Local = 'local'
}

const config = validate({
  schema: {
    HOST: Joi.string().optional(),
    PORT: Joi.number().optional(),
    DB_URL: Joi.string().required(),
    REDIS_CONNECTION_STRING: Joi.string().required(),
    JWT_SECRET: Joi.string().optional(),
    SALT_ROUNDS: Joi.number().optional(),
    ACCESS_TOKEN_EXPIRY: Joi.string().optional(),
    REFRESH_TOKEN_EXPIRY: Joi.string().optional(),
    FRONTEND_BASE_URL: Joi.string().optional(),
    /**
     * Secret key used to bypass authentication, must be unique and rotated if used in production
     */
    SERVICE_REQUEST_KEY: Joi.string().optional()
  },
  values: {
    HOST: process.env.HOST ?? '0.0.0.0',
    PORT: Number(process.env.SERVICE_PORT ?? process.env.PORT ?? 8080),
    DB_URL: process.env.DB_URL,
    REDIS_CONNECTION_STRING: process.env.REDIS_CONNECTION_STRING,
    JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS || 10),
    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY ?? '1h',
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY ?? '1d',
    FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL ?? 'http://localhost:5173',
    SERVICE_REQUEST_KEY: process.env.SERVICE_REQUEST_KEY
  }
});

export default config;
