// ============================================================================
// VOLKSCHEM OMS — Admin Routes
// ============================================================================

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { allowAdmin } = require('../middleware/roleGuard');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(authenticate, allowAdmin);

// ── Staff Management ────────────────────────────────────────────────────────
// GET    /api/v1/admin/staff
router.get('/staff', adminController.getAllStaff);

// POST   /api/v1/admin/staff
router.post('/staff', adminController.createStaff);

// PUT    /api/v1/admin/staff/:id
router.put('/staff/:id', adminController.updateStaff);

// PUT    /api/v1/admin/staff/:id/reset-password
router.put('/staff/:id/reset-password', adminController.resetPassword);

// PUT    /api/v1/admin/staff/:id/toggle-status
router.put('/staff/:id/toggle-status', adminController.toggleStatus);

// DELETE /api/v1/admin/staff/:id
router.delete('/staff/:id', adminController.deleteStaff);

// ── Login Logs ──────────────────────────────────────────────────────────────
// GET    /api/v1/admin/logs
router.get('/logs', adminController.getLoginLogs);

// DELETE /api/v1/admin/logs
router.delete('/logs', adminController.clearLoginLogs);

// ── Dashboard ───────────────────────────────────────────────────────────────
// GET    /api/v1/admin/dashboard
router.get('/dashboard', adminController.getDashboard);

// ── Orders ──────────────────────────────────────────────────────────────────
// GET    /api/v1/admin/orders
router.get('/orders', adminController.getAllOrders);

module.exports = router;
