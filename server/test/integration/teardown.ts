import * as mongo from '@/database/mongo';
import { removeDockerContainer } from '../__utils__';

export const closeConnections = async () => {
  const redis = require('@/database/redis').redis;
  await Promise.allSettled([redis.quit(), mongo.disconnect()]);
};

export default async () => {
  await Promise.allSettled([removeDockerContainer('mongo'), removeDockerContainer('redis')]);
};
