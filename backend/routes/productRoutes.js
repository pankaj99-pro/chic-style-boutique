const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  getFlashSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET /api/products - Get all products with filtering
router.get('/', getProducts);

// GET /api/products/flash-sale - Get flash sale products
router.get('/flash-sale', getFlashSaleProducts);

// GET /api/products/category/:category - Get products by category
router.get('/category/:category', getProductsByCategory);

// GET /api/products/:id - Get single product
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

module.exports = router;
