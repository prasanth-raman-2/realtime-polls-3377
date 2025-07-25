// Polls router

const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const pollCtrl = require('../controllers/polls');
const voteCtrl = require('../controllers/votes');

const router = express.Router();

// Auth required for creating/closing polls and voting
router.post('/', authenticateToken, pollCtrl.createPoll);
router.get('/', pollCtrl.listActive);
router.get('/:pollId', pollCtrl.getPoll);
router.post('/:pollId/close', authenticateToken, pollCtrl.close);

// Vote and results (user must be authenticated for voting, anyone for results)
router.post('/:pollId/vote', authenticateToken, voteCtrl.vote);
router.get('/:pollId/results', voteCtrl.results);

module.exports = router;
