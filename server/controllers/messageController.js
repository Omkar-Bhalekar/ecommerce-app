const { pool } = require('../config/db');
const { success, fail } = require('../utils/response');

exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return fail(res, 'Name, email and message are required');
    }
    const userId = req.user ? req.user.user_id : null;
    await pool.query(
      'INSERT INTO messages (user_id, name, email, message) VALUES (?, ?, ?, ?)',
      [userId, name.trim(), email.trim(), message.trim()]
    );
    return success(res, 'Message sent', null, 201);
  } catch (err) {
    console.error(err);
    return fail(res, 'Unable to send message', 500);
  }
};
