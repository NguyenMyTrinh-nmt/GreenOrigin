const express = require('express');
const router = express.Router();
const {
  addTraceRecord,
  getTraceRecords,
  getTraceRecordById,
  updateTraceRecord,
  deleteTraceRecord,
  getProductTimeline
} = require('../controllers/traceabilityController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/:productId', getTraceRecords);
router.get('/:productId/timeline', getProductTimeline);
router.get('/record/:id', getTraceRecordById);

// Protected routes
router.post('/', protect, addTraceRecord);
router.put('/record/:id', protect, updateTraceRecord);
router.delete('/record/:id', protect, authorize('admin'), deleteTraceRecord);

module.exports = router;
