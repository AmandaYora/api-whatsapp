require('dotenv').config();
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

async function ensureDatabaseExists() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
}

async function retry(fn, retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function initializeSequelize() {
  await retry(ensureDatabaseExists, 5, 3000);
  console.log(`✅ Database "${DB_NAME}" sudah tersedia.`);
  return new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false
  });
}

module.exports = initializeSequelize;
