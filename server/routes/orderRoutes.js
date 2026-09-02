const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/orderController');

router.use(auth);
router.get('/', ctrl.listOrders);
router.get('/:id', ctrl.getOrder);
router.post('/', ctrl.placeOrder);

module.exports = router;
