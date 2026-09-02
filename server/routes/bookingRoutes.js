const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bookingController');

router.get('/slots', ctrl.slots);
router.post('/', auth, ctrl.createBooking);
router.get('/', auth, ctrl.listBookings);

module.exports = router;
