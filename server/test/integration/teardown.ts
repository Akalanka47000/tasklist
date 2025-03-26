import exec from '@sliit-foss/actions-exec-wrapper';

export default async () => {
  await Promise.all([exec('docker stop redis'), exec('docker stop mongo')]);
};
