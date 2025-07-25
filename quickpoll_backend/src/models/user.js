//
// User model: provides abstraction for basic user management functions
//

const db = require('./db');

// PUBLIC_INTERFACE
async function createUser(username, email, hashedPassword) {
  /**
   * Creates a new user in the database.
   * @param {string} username
   * @param {string} email
   * @param {string} hashedPassword
   * @returns {Promise<Object>} Created user row (id, username, email, created_at)
   */
  const result = await db.query(
    `INSERT INTO users (username, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, username, email, created_at;`,
    [username, email, hashedPassword]
  );
  return result.rows[0];
}

// PUBLIC_INTERFACE
async function getUserByEmail(email) {
  /**
   * Fetch a user by email.
   */
  const result = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

// PUBLIC_INTERFACE
async function getUserById(id) {
  /**
   * Fetch a user by id.
   */
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

module.exports = { createUser, getUserByEmail, getUserById };
