//
// Votes controller: endpoint for voting and getting poll results
//

const voteModel = require('../models/vote');

// PUBLIC_INTERFACE
async function vote(req, res) {
  /**
   * @swagger
   * /polls/{pollId}/vote:
   *   post:
   *     summary: Vote on a poll option
   *     tags: [Votes]
   */
  try {
    const userId = req.user.id;
    const pollId = parseInt(req.params.pollId);
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ error: 'optionId required' });
    await voteModel.castVote(userId, pollId, optionId);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PUBLIC_INTERFACE
async function results(req, res) {
  /**
   * @swagger
   * /polls/{pollId}/results:
   *   get:
   *     summary: Get real-time poll results
   *     tags: [Votes]
   */
  try {
    const pollId = parseInt(req.params.pollId);
    const results = await voteModel.getPollResults(pollId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { vote, results };
