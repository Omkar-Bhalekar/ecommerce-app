const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoryController');

router.get('/', ctrl.listCategories);
router.get('/:id', ctrl.getCategory);

module.exports = router;
