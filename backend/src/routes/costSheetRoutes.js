// ============================================================================
// VOLKSCHEM OMS — Cost Sheet Routes
// ============================================================================

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowAdmin, allowAdminAndEmployee } = require('../middleware/roleGuard');
const costSheetController = require('../controllers/costSheetController');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET    /api/v1/cost-sheet              — admin + employee can view
router.get('/', allowAdminAndEmployee, costSheetController.getAllRates);

// GET    /api/v1/cost-sheet/rate?category=...&item=...&size=...
router.get('/rate', allowAdminAndEmployee, costSheetController.lookupRate);

// GET    /api/v1/cost-sheet/category/:category
router.get('/category/:category', allowAdminAndEmployee, costSheetController.getRatesByCategory);

// PUT    /api/v1/cost-sheet/:id          — admin only
router.put('/:id', allowAdmin, costSheetController.updateRate);

// POST   /api/v1/cost-sheet              — admin only: add new item
router.post('/', allowAdmin, costSheetController.createRate);

// DELETE /api/v1/cost-sheet/:id          — admin only
router.delete('/:id', allowAdmin, costSheetController.deleteRate);

module.exports = router;
