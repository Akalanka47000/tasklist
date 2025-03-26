export * from './auth';
export * from './docker';

export const waitFor = async (conditionFn: () => Promise<any>, timeout = 5000, interval = 500) => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      await conditionFn();
      return true;
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  return false;
};
