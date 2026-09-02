const jwt = require('jsonwebtoken');
const { fail } = require('../utils/response');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return fail(res, 'Authentication required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { user_id: decoded.user_id, email: decoded.email };
    next();
  } catch {
    return fail(res, 'Invalid or expired token', 401);
  }
}

module.exports = authMiddleware;
