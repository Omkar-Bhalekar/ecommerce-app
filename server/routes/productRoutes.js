const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.listProducts);
router.get('/search', ctrl.searchProducts);
router.get('/filters', ctrl.filters);
router.get('/category/:categoryId', ctrl.getByCategory);
router.get('/:id', ctrl.getProduct);
router.post('/', ctrl.createProduct);
router.put('/:id', ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;
