const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['product_creation', 'trace_record', 'ownership_transfer', 'quality_check']
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  from: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  to: {
    type: String,
    trim: true,
    lowercase: true
  },
  blockNumber: {
    type: Number
  },
  gasUsed: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh
transactionSchema.index({ productId: 1, timestamp: -1 });
transactionSchema.index({ transactionHash: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
