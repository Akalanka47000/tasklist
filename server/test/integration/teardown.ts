import * as mongo from '@/database/mongo';
import { removeDockerContainer } from '../__utils__';

export default async () => {
  await new Promise((resolve) => {
    setTimeout(async () => {
      const redis = require('@/database/redis').redis;
      await Promise.allSettled([redis.quit(), mongo.disconnect()]);
      await Promise.allSettled([removeDockerContainer('mongo'), removeDockerContainer('redis')]);
      resolve(true);
    }, 2000); // Allow 2 seconds for async tasks to complete
  });
};
