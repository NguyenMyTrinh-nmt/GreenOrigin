const mongoose = require('mongoose');

const productUpdateSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  updateType: {
    type: String,
    enum: ['CREATE', 'UPDATE_INFO', 'UPDATE_CERTIFICATION', 'UPDATE_DATES'],
    default: 'UPDATE_INFO'
  },
  updatedFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // Lưu toàn bộ snapshot tại thời điểm update
  snapshot: {
    name: String,
    supplier: String,
    location: String,
    packingLocation: String,
    lotNumber: String,
    harvestDate: Date,
    packingDate: Date,
    deliveryDate: Date,
    certifications: [{
      name: String,
      standard: String,
      certificateNumber: String,
      validUntil: Date,
      issuedBy: String
    }],
    description: String,
    imageUrl: String
  },
  // Blockchain info
  blockchainHash: {
    type: String,
    default: ''
  },
  transactionHash: {
    type: String,
    default: ''
  },
  isOnBlockchain: {
    type: Boolean,
    default: false
  },
  // Metadata
  updatedBy: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index để query nhanh
productUpdateSchema.index({ productId: 1, timestamp: -1 });

module.exports = mongoose.model('ProductUpdate', productUpdateSchema);
