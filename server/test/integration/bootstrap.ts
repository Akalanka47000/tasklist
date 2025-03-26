import 'tsconfig-paths/register';
import exec from '@sliit-foss/actions-exec-wrapper';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default async () => {
  await Promise.allSettled([
    exec('docker run -d --name redis -p 6379:6379 redis:6'),
    exec('docker run -d --name mongo -p 27017:27017 mongo:7')
  ]);
  await new Promise((resolve) => setTimeout(resolve, 5000));
};
