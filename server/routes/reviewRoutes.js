const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/reviewController');

router.get('/:productId', ctrl.listReviews);
router.post('/', auth, ctrl.createReview);

module.exports = router;
