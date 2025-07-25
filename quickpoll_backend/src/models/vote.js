//
// Vote model for handling voting and querying votes/results
//

const db = require('./db');

// PUBLIC_INTERFACE
async function castVote(userId, pollId, optionId) {
  /**
   * Cast a vote for a poll option, prevent duplicate votes per user+poll
   */
  // Check if user has voted
  const check = await db.query(
    'SELECT * FROM votes WHERE user_id = $1 AND poll_id = $2',
    [userId, pollId]
  );
  if (check.rowCount > 0) {
    throw new Error('User has already voted');
  }
  await db.query(
    `INSERT INTO votes (user_id, poll_id, option_id)
     VALUES ($1, $2, $3);`,
    [userId, pollId, optionId]
  );
  return true;
}

// PUBLIC_INTERFACE
async function getPollResults(pollId) {
  /**
   * Get count of votes per option for a poll.
   * Returns array [{ option_id, option_text, votes }]
   */
  const result = await db.query(
    `
    SELECT o.id AS option_id, o.option_text, COUNT(v.id) AS votes
    FROM poll_options o
    LEFT JOIN votes v ON v.option_id = o.id
    WHERE o.poll_id = $1
    GROUP BY o.id, o.option_text
    ORDER BY o.id
    `,
    [pollId]
  );
  return result.rows;
}

module.exports = { castVote, getPollResults };
