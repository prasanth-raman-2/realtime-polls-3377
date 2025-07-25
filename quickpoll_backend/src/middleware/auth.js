//
// JWT Authentication middleware for Express routes. Provides helpers for generating and verifying tokens.
//

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

// PUBLIC_INTERFACE
function authenticateToken(req, res, next) {
  /** Express middleware to verify Authorization: Bearer <token> */
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid/expired token' });
    }
    req.user = user;
    next();
  });
}

// PUBLIC_INTERFACE
function generateToken(user) {
  /** Generate a new JWT token for user object {id, email, username} */
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

module.exports = { authenticateToken, generateToken };
