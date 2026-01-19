const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Tất cả routes đều cần authentication
router.post('/', auth, upload.single('image'), createProduct);
router.get('/', auth, getAllProducts);
router.get('/:id', auth, getProductById);
router.put('/:id', auth, upload.single('image'), updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
