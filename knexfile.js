const path = require('path');
const { knexConfig } = require('./root/src/config/database');

module.exports = {
  ...knexConfig,
  migrations: {
    directory: path.join(__dirname, 'root', 'src', 'migrations'),
    tableName: 'knex_migrations'
  }
};
