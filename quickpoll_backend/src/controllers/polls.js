//
// Polls controller: creating, listing, closing, and fetching polls
//

const pollModel = require('../models/poll');

// PUBLIC_INTERFACE
async function createPoll(req, res) {
  /**
   * @swagger
   * /polls:
   *   post:
   *     summary: Create a poll
   *     tags: [Polls]
   */
  try {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2)
      return res.status(400).json({ error: 'question and at least two options required' });
    const poll = await pollModel.createPoll(req.user.id, question, options);
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
async function listActive(req, res) {
  /**
   * @swagger
   * /polls:
   *   get:
   *     summary: List all active polls
   *     tags: [Polls]
   */
  try {
    const polls = await pollModel.listActivePolls();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
async function getPoll(req, res) {
  /**
   * @swagger
   * /polls/{pollId}:
   *   get:
   *     summary: Get a poll and its options
   *     tags: [Polls]
   */
  try {
    const poll = await pollModel.getPollById(parseInt(req.params.pollId));
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
async function close(req, res) {
  /**
   * @swagger
   * /polls/{pollId}/close:
   *   post:
   *     summary: Close a poll
   *     tags: [Polls]
   */
  try {
    await pollModel.closePoll(parseInt(req.params.pollId));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createPoll, listActive, getPoll, close };
