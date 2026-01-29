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
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['rau', 'củ', 'quả', 'ngũ cốc','hạt', 'khác'],
    default: 'khác'
  },
  description: {
    type: String,
    trim: true
  },
  farmerId: {
    type: String,
    required: true
  },
  farmerName: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  // Thông tin chi tiết sản phẩm
  supplier: {
    type: String,
    trim: true,
    default: ''
  },
  packingLocation: {
    type: String,
    trim: true,
    default: ''
  },
  lotNumber: {
    type: String,
    trim: true,
    default: ''
  },
  harvestDate: {
    type: Date,
    default: Date.now
  },
  packingDate: {
    type: Date
  },
  deliveryDate: {
    type: Date
  },
  // Thông tin chứng nhận
  certifications: [{
    name: String,        // VietGAP, GlobalGAP, Organic...
    standard: String,    // Tiêu chuẩn
    certificateNumber: String,  // Mã số giấy chứng nhận
    validUntil: Date,    // Có hiệu lực đến
    issuedBy: String,    // Cơ quan cấp
    documentUrl: String  // Link tài liệu
  }],
  quantity: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'kg'
  },
  imageUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold out'],
    default: 'active'
  },
  createdBy: {
    type: String,
    required: true
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

// Index để tìm kiếm nhanh
productSchema.index({ productId: 1 });
productSchema.index({ farmerId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
