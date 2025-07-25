//
// Database connection and model definitions for the quickpoll backend.
// Uses environment variables from .env for database configuration.
//

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: process.env.DB_SSLMODE === 'require',
});

async function query(text, params) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'test') {
    console.log('executed query', { text, duration, rows: res.rowCount });
  }
  return res;
}

module.exports = {
  pool,
  query,
};
