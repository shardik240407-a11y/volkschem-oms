// ============================================================================
// VOLKSCHEM OMS — Bulk Price Routes
// ============================================================================

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowAdmin, allowAdminAndEmployee } = require('../middleware/roleGuard');
const bulkPriceController = require('../controllers/bulkPriceController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET    /api/v1/bulk-prices             — list all
router.get('/', allowAdminAndEmployee, bulkPriceController.getAllBulkPrices);

// GET    /api/v1/bulk-prices/search?q=   — search by material name
router.get('/search', allowAdminAndEmployee, bulkPriceController.searchBulkPrices);

// POST   /api/v1/bulk-prices             — add new (admin only)
router.post('/', allowAdmin, bulkPriceController.createBulkPrice);

// PUT    /api/v1/bulk-prices/:id         — update (admin only)
router.put('/:id', allowAdmin, bulkPriceController.updateBulkPrice);

// DELETE /api/v1/bulk-prices/:id         — delete (admin only)
router.delete('/:id', allowAdmin, bulkPriceController.deleteBulkPrice);

module.exports = router;
