const express = require('express');
const healthController = require('../controllers/health');
const usersRouter = require('./users');
const pollsRouter = require('./polls');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 */
router.get('/', healthController.check.bind(healthController));

// API endpoints for users and polls
router.use('/users', usersRouter);
router.use('/polls', pollsRouter);

module.exports = router;
