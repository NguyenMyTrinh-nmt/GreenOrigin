const express = require('express');
const router = express.Router();
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

// Thêm sản phẩm mới vào blockchain
router.post('/products', addProduct);

// Đồng bộ trạng thái blockchain
router.get('/sync/:productId', syncBlockchainStatus);

// Lấy danh sách tất cả các batches
router.get('/', getAllBatches);

// Lấy thống kê
router.get('/stats', getStats);

// Lấy thông tin một sản phẩm
router.get('/:productId', getProduct);

// Thêm bước truy vết cho sản phẩm
router.post('/:productId/traces', addTrace);

// Lấy tất cả bước truy vết của sản phẩm
router.get('/:productId/traces', getTraces);

module.exports = router;
