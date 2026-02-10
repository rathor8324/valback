require('dotenv').config();
const mysql = require('mysql2/promise');

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'valback_db';
  
  // Connect without specifying database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@Legion123'
  });

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created or already exists`);
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    await connection.end();
    process.exit(1);
  }
}

createDatabase();
