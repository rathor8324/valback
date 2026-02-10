require('dotenv').config();
const knex = require('knex');

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@Legion123',
    database: process.env.DB_NAME || 'user',
    charset: 'utf8mb4'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './src/migrations',
    tableName: 'knex_migrations'
  }
};

const db = knex(config);

module.exports = db;
