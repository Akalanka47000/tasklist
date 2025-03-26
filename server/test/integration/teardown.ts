import * as mongo from '@/database/mongo';
import { removeDockerContainer } from '../__utils__';

export const closeConnections = async () => {
  const redis = require('@/database/redis').redis;
  await Promise.allSettled([redis.quit(), mongo.disconnect()]);
};

export default async () => {
  await new Promise(resolve=>{
    setTimeout(()=>{
      Promise.allSettled([removeDockerContainer('mongo'), removeDockerContainer('redis')]).then(resolve)
    }, 3000)  // Allow 3 seconds for async tasks to complete
  })
};
