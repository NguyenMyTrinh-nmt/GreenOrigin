const mongoose = require('mongoose');

const traceabilityRecordSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productId: {
    type: String,
    required: true,
    index: true
  },
  stage: {
    type: String,
    required: true,
    enum: ['planting', 'growing', 'harvesting', 'processing', 'packaging', 'shipping', 'distribution', 'retail']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    address: String,
    province: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  performer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  performerInfo: {
    name: String,
    role: String,
    walletAddress: String
  },
  images: [{
    type: String
  }],
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  metadata: {
    temperature: String,
    humidity: String,
    weight: String,
    quality: String,
    notes: String
  },
  blockchainTxHash: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index để tìm kiếm nhanh
traceabilityRecordSchema.index({ productId: 1, timestamp: -1 });

module.exports = mongoose.model('TraceabilityRecord', traceabilityRecordSchema);
