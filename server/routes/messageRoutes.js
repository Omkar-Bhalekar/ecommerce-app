const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/messageController');

function optionalAuth(req, _res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { user_id: decoded.user_id, email: decoded.email };
    } catch {
      req.user = null;
    }
  }
  next();
}

router.post('/', optionalAuth, ctrl.createMessage);

module.exports = router;
