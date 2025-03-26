import 'tsconfig-paths/register';
import * as dotenv from 'dotenv';
import * as mongo from '@/database/mongo';
import { runDockerContainer, waitFor } from '../__utils__';

dotenv.config({ path: '.env.test' });

process.env.DISABLE_FUNCTION_TRACING = 'true';

export default async () => {
  await Promise.all([runDockerContainer('redis', 6379), runDockerContainer('mongo', 27017)]);
  await waitFor(mongo.ping);
};
