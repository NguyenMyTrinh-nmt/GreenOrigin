const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const upload = require('../middleware/upload');
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  updateProductByProductId,
  getProductUpdateHistory,
  deleteProduct
} = require('../controllers/productController');

// Routes xem sản phẩm - tất cả roles (bao gồm CONSUMER)
router.get('/', auth, getAllProducts);
router.get('/:id', auth, getProductById);
router.get('/history/:productId', auth, getProductUpdateHistory);

// Routes thêm sản phẩm - chỉ ADMIN và GROWER
router.post('/', auth, authorizeRole('ADMIN', 'GROWER'), upload.single('image'), createProduct);

// Routes sửa sản phẩm - chỉ ADMIN và GROWER
router.put('/:id', auth, authorizeRole('ADMIN', 'GROWER'), upload.single('image'), updateProduct);
router.put('/by-product-id/:productId', auth, authorizeRole('ADMIN', 'GROWER'), updateProductByProductId);

// Routes xóa sản phẩm - chỉ ADMIN
router.delete('/:id', auth, authorizeRole('ADMIN'), deleteProduct);

module.exports = router;
