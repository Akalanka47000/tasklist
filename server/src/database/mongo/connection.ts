import { moduleLogger } from '@sliit-foss/module-logger';
import mongoose from 'mongoose';

const logger = moduleLogger('Database-Connector');

/**
 * @description This function is used to connect to the database using the DB_URL environment variable. It also handles database errors and disconnections.
 * @param {mongoose.ConnectOptions} options The options to be used when connecting to the database
 * @returns void
 **/
export const connect = async (options?: mongoose.ConnectOptions) => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      socketTimeoutMS: 30000,
      maxIdleTimeMS: 30000,
      ...options
    });
    logger.info(`Connected to database successfully`);
  } catch (err) {
    logger.error(`Failed to connect to database | message: ${err.message}`);
  }

  mongoose.connection.on('error', (err) =>
    logger.error(`Database error - message: ${err.message} - error: ${err.message}`)
  );

  mongoose.connection.on('disconnected', () => logger.error(`Database disconnected`));

  mongoose.connection.on('reconnected', () => logger.info(`Database reconnected`));
};

export const disconnect = () => mongoose.disconnect();

export const ping = () => mongoose.connection.db.admin().ping();
