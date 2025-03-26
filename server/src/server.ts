// prettier-ignore
import 'dotenv/config';
import { moduleLogger } from '@sliit-foss/module-logger';
import { default as config } from '@/config';
import * as database from '@/database/mongo';
import { app, service } from './app';

const logger = moduleLogger(service);

const server = app.listen(config.PORT, config.HOST, () => {
  logger.info(`${service} listening on ${config.HOST}:${config.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Server shutdown initiated');
  server.close(() => {
    if (process.env.NODE_ENV === 'development') return process.exit(0);
    logger.info('Server shutdown complete. Exiting after 30 seconds');
    setTimeout(async () => {
      await database.disconnect();
      process.exit(0);
    }, 30000);
  });
});
