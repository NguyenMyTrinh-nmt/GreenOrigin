const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['GROWER', 'TRANSPORTER', 'VERIFIER', 'ADMIN'],
    default: 'GROWER'
  },
  email: {
    type: String,
    trim: true
  },
  walletAddress: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
