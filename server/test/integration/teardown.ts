import * as mongo from '@/database/mongo';
import { removeDockerContainer } from '../__utils__';

export const closeConnections = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      const redis = require('@/database/redis').redis;
      Promise.allSettled([redis.quit(), mongo.disconnect()]).then(resolve);
    }, 2000); // Allow 2 seconds for async tasks to complete
  });
};

export default async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      Promise.allSettled([removeDockerContainer('mongo'), removeDockerContainer('redis')]).then(resolve);
    }, 2000); // Allow 2 seconds for async tasks to complete
  });
};
