// ============================================================================
// VOLKSCHEM OMS — Auth Routes
// ============================================================================

const express = require('express');
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

// Rate limit auth endpoints: 10 requests per minute per IP
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    data: null,
    message: 'Too many login attempts. Please try again after 1 minute.',
    errors: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /api/v1/auth/login
router.post('/login', authLimiter, authController.login);

// POST /api/v1/auth/logout
router.post('/logout', authenticate, authController.logout);

// GET /api/v1/auth/me
router.get('/me', authenticate, authController.getMe);

module.exports = router;
