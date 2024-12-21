// src/utils/DataBaseProvider/db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
});

// Set default schema on connection
pool.on('connect', () => {
  pool.query(`SET search_path TO "${process.env.DB_SCHEMA}"`, (err) => {
    if (err) {
      console.error('Error setting search_path:', err);
    } else {
      console.log(`Schema set to ${process.env.DB_SCHEMA}`);
    }
  });
});

module.exports = pool;
