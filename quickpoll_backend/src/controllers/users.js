//
// Users controller: registration and login endpoints
//

const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { generateToken } = require('../middleware/auth');

// PUBLIC_INTERFACE
async function register(req, res) {
  /**
   * @swagger
   * /users/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Users]
   */
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'username, email, and password required' });

    if (await userModel.getUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(username, email, hashedPassword);
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user.id, username, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
async function login(req, res) {
  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Users]
   */
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });
    const user = await userModel.getUserByEmail(email);
    if (!user)
      return res.status(404).json({ error: 'User does not exist' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return res.status(401).json({ error: 'Invalid password' });
    const token = generateToken(user);
    res.status(200).json({ token, user: { id: user.id, username: user.username, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };
