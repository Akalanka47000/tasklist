const migrations = require('./migrations');

module.exports = {
  ...migrations,
  migrationsDir: 'src/database/config/seeds'
} as import('migrate-mongo').config.Config;
