// ============================================================================
// VOLKSCHEM OMS — Label Routes
// ============================================================================

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowAdmin, allowAdminAndEmployee } = require('../middleware/roleGuard');
const labelController = require('../controllers/labelController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET    /api/v1/labels/:productId          — get label stock for a product
router.get('/:productId', allowAdminAndEmployee, labelController.getLabelStock);

// POST   /api/v1/labels/check               — check availability for an order
router.post('/check', allowAdminAndEmployee, labelController.checkAvailability);

// POST   /api/v1/labels/batch               — add new label batch (MOQ 1000)
router.post('/batch', allowAdminAndEmployee, labelController.addBatch);

// GET    /api/v1/labels/transactions/:productId — full audit trail
router.get('/transactions/:productId', allowAdminAndEmployee, labelController.getTransactions);

module.exports = router;
