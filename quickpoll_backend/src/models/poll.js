//
// Poll model: abstraction for polls and choices
//

const db = require('./db');

// PUBLIC_INTERFACE
async function createPoll(ownerId, question, options, isActive = true) {
  /**
   * Creates a new poll and its options (choices).
   * @param {number} ownerId - User ID of poll creator
   * @param {string} question - The poll question
   * @param {string[]} options - Array of choice texts
   * @param {boolean} isActive - Whether the poll is open
   */
  const pollResult = await db.query(
    `INSERT INTO polls (owner_id, question, is_active)
     VALUES ($1, $2, $3)
     RETURNING id, question, is_active, created_at;`,
    [ownerId, question, isActive]
  );
  const poll = pollResult.rows[0];

  // Generate parameter placeholders: ($1, $2), ($1, $3), ...
  var valueStrings = [];
  for (let idx = 0; idx < options.length; ++idx) {
    valueStrings.push('($1, $' + (idx + 2) + ')');
  }
  const params = [poll.id].concat(options);
  await db.query(
    'INSERT INTO poll_options (poll_id, option_text) VALUES ' +
      valueStrings.join(', '),
    params
  );
  return poll;
}

// PUBLIC_INTERFACE
async function getPollById(id) {
  /**
   * Fetch a poll and its options.
   */
  const pollRes = await db.query('SELECT * FROM polls WHERE id = $1', [id]);
  if (pollRes.rowCount === 0) return null;
  const poll = pollRes.rows[0];
  const optionsRes = await db.query('SELECT id, option_text FROM poll_options WHERE poll_id = $1', [id]);
  poll.options = optionsRes.rows;
  return poll;
}

// PUBLIC_INTERFACE
async function listActivePolls() {
  /**
   * List all active polls.
   */
  const pollsRes = await db.query('SELECT * FROM polls WHERE is_active = true ORDER BY created_at DESC');
  return pollsRes.rows;
}

// PUBLIC_INTERFACE
async function closePoll(pollId) {
  /**
   * Set poll is_active=false
   */
  await db.query('UPDATE polls SET is_active = false WHERE id = $1', [pollId]);
  return true;
}

module.exports = {
  createPoll,
  getPollById,
  listActivePolls,
  closePoll,
};
