const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetable', 'fruit', 'grain', 'herb', 'other']
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  origin: {
    province: String,
    district: String,
    ward: String,
    address: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  quantity: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true,
      enum: ['kg', 'tấn', 'bó', 'quả', 'hộp']
    }
  },
  certifications: [{
    name: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateUrl: String
  }],
  blockchainTxHash: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['harvested', 'processing', 'in-transit', 'delivered', 'sold'],
    default: 'harvested'
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Tự động cập nhật updatedAt
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
