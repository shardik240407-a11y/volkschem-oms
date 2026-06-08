// ============================================================================
// VOLKSCHEM OMS — Order Routes
// ============================================================================

const express = require('express');
const multer = require('multer');
const { authenticate } = require('../middleware/auth');
const { allowAdmin, allowFactory, allowAll } = require('../middleware/roleGuard');
const orderController = require('../controllers/orderController');

const router = express.Router();

// Multer for LR file uploads (in-memory, max 10MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPEG, and PNG files are allowed.'), false);
    }
  },
});

// All routes require authentication
router.use(authenticate);

// GET    /api/v1/orders                — factory: stripped view, admin: full view
router.get('/', allowAll, orderController.getOrders);

// PUT    /api/v1/orders/:id/status     — factory updates status
router.put('/:id/status', allowFactory, orderController.updateStatus);

// POST   /api/v1/orders/:id/lr         — factory uploads LR
router.post('/:id/lr', allowFactory, upload.single('lr_file'), orderController.uploadLR);

// GET    /api/v1/orders/:id/lr         — admin + concerned employee
router.get('/:id/lr', allowAll, orderController.getLR);

// DELETE /api/v1/orders/:id/lr         — factory deletes LR
router.delete('/:id/lr', allowFactory, orderController.deleteLR);

// PUT    /api/v1/orders/:id/note       — factory updates production note
router.put('/:id/note', allowFactory, orderController.updateNote);

// GET    /api/v1/orders/:id/progress   — factory/admin fetches status timeline
router.get('/:id/progress', allowAll, orderController.getProgress);

// DELETE /api/v1/orders/:id            — factory/admin deletes an order
router.delete('/:id', allowAll, orderController.deleteOrder);

module.exports = router;
