const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/paymentController');

router.get('/methods', ctrl.methods);
router.post('/simulate', auth, ctrl.simulate);

module.exports = router;
