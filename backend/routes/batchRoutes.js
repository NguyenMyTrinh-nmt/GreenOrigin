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

// Thêm sản phẩm mới vào blockchain (ADMIN và GROWER)
router.post('/products', auth, authorizeRole('ADMIN', 'GROWER'), addProduct);

// Đồng bộ trạng thái blockchain
router.get('/sync/:productId', syncBlockchainStatus);

// Lấy danh sách tất cả các batches (tất cả roles)
router.get('/', getAllBatches);

// Lấy thống kê (tất cả roles)
router.get('/stats', getStats);

// Lấy thông tin một sản phẩm (tất cả roles - bao gồm CONSUMER)
router.get('/:productId', getProduct);

// Thêm bước truy vết cho sản phẩm 
// GROWER: thêm thông tin gieo trồng, thu hoạch
// TRANSPORTER: thêm thông tin vận chuyển
// VERIFIER: thêm kết quả kiểm định
// ADMIN: toàn quyền
router.post('/:productId/traces', auth, authorizeRole('GROWER', 'TRANSPORTER', 'VERIFIER', 'ADMIN'), addTrace);

// Lấy tất cả bước truy vết của sản phẩm (tất cả roles - bao gồm CONSUMER)
router.get('/:productId/traces', getTraces);

module.exports = router;
