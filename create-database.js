require('dotenv').config();
const mysql = require('mysql2/promise');
const { baseConnection } = require('./root/src/config/database');

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: baseConnection.host,
    port: baseConnection.port,
    user: baseConnection.user,
    password: baseConnection.password
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${baseConnection.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    console.log(`Database '${baseConnection.database}' created or already exists`);
  } finally {
    await connection.end();
  }
}

createDatabase().catch((error) => {
  console.error('Error creating database:', error.message);
  process.exit(1);
});
