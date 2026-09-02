const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/forgot-password', auth.forgotPassword);
router.get('/me', authMiddleware, auth.me);
router.put('/me', authMiddleware, auth.updateProfile);
router.get('/stats', authMiddleware, auth.stats);

module.exports = router;
