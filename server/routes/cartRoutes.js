const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/cartController');

router.use(auth);
router.get('/', ctrl.getCart);
router.post('/', ctrl.addToCart);
router.put('/:itemId', ctrl.updateCartItem);
router.delete('/:itemId', ctrl.removeCartItem);

module.exports = router;
