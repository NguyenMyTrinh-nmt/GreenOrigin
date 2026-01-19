const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  getProductByCode,
  updateProduct,
  deleteProduct,
  updateProductStatus
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getProducts);
router.get('/code/:productId', getProductByCode);
router.get('/:id', getProductById);

// Protected routes
router.post('/', protect, authorize('farmer', 'processor', 'admin'), createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.put('/:id/status', protect, updateProductStatus);

module.exports = router;
