const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/addressController');

router.use(auth);
router.get('/', ctrl.listAddresses);
router.post('/', ctrl.createAddress);
router.put('/:id', ctrl.updateAddress);
router.delete('/:id', ctrl.deleteAddress);
router.patch('/:id/default', ctrl.setDefault);

module.exports = router;
