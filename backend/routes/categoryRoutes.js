const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// GET /api/categories - Get all categories
router.get('/', getCategories);

// GET /api/categories/:slug - Get single category
router.get('/:slug', getCategoryBySlug);

// POST /api/categories - Create new category
router.post('/', createCategory);

// PUT /api/categories/:slug - Update category
router.put('/:slug', updateCategory);

// DELETE /api/categories/:slug - Delete category
router.delete('/:slug', deleteCategory);

module.exports = router;
