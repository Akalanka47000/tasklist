import { resetAuthStore } from './auth';
import { resetTaskStore } from './task';

export const resetStores = () => {
  resetAuthStore();
  resetTaskStore();
};
