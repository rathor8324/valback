require('dotenv').config();

const baseConnection = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'user',
  charset: 'utf8mb4'
};

const knexConfig = {
  client: 'mysql2',
  connection: baseConnection,
  pool: {
    min: 2,
    max: 10
  }
};

module.exports = {
  baseConnection,
  knexConfig
};
