require('dotenv/config');

/** @type {import('migrate-mongo').config.Config} */
module.exports = {
  mongodb: {
    url: process.env.DB_URL,
    options: {
      maxPoolSize: 1000,
      minPoolSize: 100,
      socketTimeoutMS: 30000
    }
  },
  migrationsDir: 'src/database/mongo/migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.ts',
  useFileHash: false,
  moduleSystem: 'esm'
};
