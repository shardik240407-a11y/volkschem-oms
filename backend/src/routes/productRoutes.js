// ============================================================================
// VOLKSCHEM OMS — Product Routes
// ============================================================================

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowAdmin, allowAdminAndEmployee } = require('../middleware/roleGuard');
const productController = require('../controllers/productController');

const router = express.Router();

// All product routes require authentication
router.use(authenticate);

// GET    /api/v1/products        — admin + employee can view
router.get('/', allowAdminAndEmployee, productController.getAllProducts);

// GET    /api/v1/products/:id    — admin + employee can view
router.get('/:id', allowAdminAndEmployee, productController.getProduct);

// POST   /api/v1/products        — admin only
router.post('/', allowAdmin, productController.createProduct);

// PUT    /api/v1/products/:id    — admin only
router.put('/:id', allowAdmin, productController.updateProduct);

// DELETE /api/v1/products/:id    — admin only (soft delete)
router.delete('/:id', allowAdmin, productController.deleteProduct);

module.exports = router;
