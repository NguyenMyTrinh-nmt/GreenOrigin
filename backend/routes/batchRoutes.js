const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');
const { 
  createBatch, 
  addProduct,
  addTrace, 
  getProduct, 
  getTraces,
  getAllBatches,
  getStats,
  syncBlockchainStatus
} = require('../controllers/batchController');

// Tạo batch mới (legacy)
router.post('/', createBatch);

// Thêm sản phẩm mới vào blockchain (chỉ ADMIN)
router.post('/products', auth, authorizeRole('ADMIN'), addProduct);

// Đồng bộ trạng thái blockchain
router.get('/sync/:productId', syncBlockchainStatus);

// Lấy danh sách tất cả các batches
router.get('/', getAllBatches);

// Lấy thống kê
router.get('/stats', getStats);

// Lấy thông tin một sản phẩm
router.get('/:productId', getProduct);

// Thêm bước truy vết cho sản phẩm (người tham gia chuỗi cung ứng)
router.post('/:productId/traces', auth, authorizeRole('GROWER', 'TRANSPORTER', 'VERIFIER', 'ADMIN'), addTrace);

// Lấy tất cả bước truy vết của sản phẩm
router.get('/:productId/traces', getTraces);

module.exports = router;
