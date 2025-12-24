const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  getDashboardStats
} = require('../controllers/adminController');
const {
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Products CRUD
router.route('/products')
  .get(getAllProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Categories
router.get('/categories', getAllCategories);

// Orders management
router.get('/orders', getAllOrders);
router.get('/orders/stats', getOrderStats);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
