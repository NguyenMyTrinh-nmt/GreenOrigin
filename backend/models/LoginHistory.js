const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    lowercase: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  message: {
    type: String
  }
});

// Index để tìm kiếm nhanh
loginHistorySchema.index({ walletAddress: 1, loginTime: -1 });

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
