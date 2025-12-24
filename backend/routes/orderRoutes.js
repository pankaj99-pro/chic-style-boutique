const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getOrderById
} = require('../controllers/orderController');

// All routes require authentication
router.use(protect);

// Create new order
router.post('/', createOrder);

// Get user's orders
router.get('/', getUserOrders);

// Get single order
router.get('/:id', getOrderById);

module.exports = router;
