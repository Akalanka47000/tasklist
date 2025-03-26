const migrations = require('./migrations');

/** @type {import('migrate-mongo').config.Config} */
module.exports = {
  ...migrations,
  migrationsDir: 'src/database/mongo/seeds'
};
