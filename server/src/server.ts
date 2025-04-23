// prettier-ignore
import 'dotenv/config';
import { default as clusterize, type ClusterizerOptions } from '@sliit-foss/clusterizer';
import { moduleLogger } from '@sliit-foss/module-logger';
import { default as config } from '@/config';
import * as database from '@/database/mongo';

const options: ClusterizerOptions = {
  logger: moduleLogger('Clusterizer'),
  workers: config.CLUSTER_SIZE
};

clusterize((processID) => {
  const { app, service } = require('./app');

  const logger = moduleLogger(`${service} >>> pid::${processID}`);

  const server = app.listen(config.PORT, config.HOST, () => {
    logger.info(`${service} listening on ${config.HOST}:${config.PORT}`);
  });

  if (process.env.NODE_ENV === 'production') {
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM. Server shutdown initiated');
      server.close(() => {
        logger.info('Server shutdown complete. Exiting after 30 seconds');
        setTimeout(async () => {
          await database.disconnect();
          process.exit(0);
        }, 30000);
      });
    });
  }
}, options);
