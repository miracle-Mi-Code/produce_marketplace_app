const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getReceivedOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { orderValidation } = require('../middleware/validate');

// Buyer actions
router.post('/', authenticate, authorizeRole('buyer', 'both'), orderValidation, createOrder);
router.get('/mine', authenticate, authorizeRole('buyer', 'both'), getMyOrders);

// Farmer actions
router.get('/received', authenticate, authorizeRole('farmer', 'both'), getReceivedOrders);

// Status updates (Farmer or Buyer status modification)
router.patch('/:id/status', authenticate, updateOrderStatus);

module.exports = router;
