import { moduleLogger } from '@sliit-foss/module-logger';
import { z } from '@sliit-foss/zelebrate';

const logger = moduleLogger('Config');

export enum Environment {
  Production = 'production',
  Development = 'development',
  Local = 'local'
}

/**
 * @description Validates a set of values against the given schema. If validation fails, the process exits with code 1 with an error message.
 * @returns The validated config values
 */
const validate = <T extends z.ZodRawShape>({
  schema,
  values
}: {
  schema: z.ZodObject<T>;
  values: Record<string, string | undefined>;
}) => {
  try {
    return schema.parse(values);
  } catch (e) {
    logger.error(`Environment validation failed. \nDetails - ${e}\nExiting...`);
    process.exit(1);
  }
};

const config = validate({
  schema: z.object({
    HOST: z.string().default('0.0.0.0'),
    PORT: z.number().default(8080),
    CLUSTER_SIZE: z.coerce.number().optional(),
    DB_URL: z.string(),
    REDIS_CONNECTION_STRING: z.string(),
    JWT_SECRET: z.string().default('secret'),
    SALT_ROUNDS: z.number().default(10),
    ACCESS_TOKEN_EXPIRY: z.string().default('1h'),
    REFRESH_TOKEN_EXPIRY: z.string().default('1d'),
    FRONTEND_BASE_URL: z.string().default('http://localhost:5173'),
    /**
     * Secret key used to bypass authentication, must be unique and rotated if used in production
     */
    SERVICE_REQUEST_KEY: z.string().optional(),
    DEPLOYMENT_ENVIRONMENT: z.nativeEnum(Environment).optional()
  }),
  values: {
    ...process.env,
    CLUSTER_SIZE: process.env.NODE_ENV === 'production' ? process.env.CLUSTER_SIZE : '1',
    PORT: process.env.SERVICE_PORT ?? process.env.PORT
  }
});

export default config;
