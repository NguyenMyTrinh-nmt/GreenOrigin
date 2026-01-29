require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

async function restoreProduct() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const product = await Product.findOne({ productId: 'SP0030' });
    
    if (!product) {
      console.log('❌ Không tìm thấy sản phẩm SP0030');
      await mongoose.connection.close();
      return;
    }

    console.log('📋 Khôi phục thông tin sản phẩm Thanh Long...\n');

    // Khôi phục dữ liệu đúng
    product.supplier = 'HKD Nguyễn Văn Thi';
    product.location = 'Bình Thuận';
    product.packingLocation = 'Ấp 2, Bình Thuận';
    product.lotNumber = 'Bình Thuận - Khu 03 - Thanh Long';
    
    // Khôi phục ngày tháng
    const harvestDate = new Date('2026-01-23');
    const packingDate = new Date('2026-01-24');
    const deliveryDate = new Date('2026-01-25');
    
    product.harvestDate = harvestDate;
    product.packingDate = packingDate;
    product.deliveryDate = deliveryDate;
    
    // Khôi phục chứng nhận
    product.certifications = [
      {
        name: 'VietGAP',
        standard: 'Bản Cam Kết, Sản Xuất, Kinh Doanh Thực Phẩm Nông Lâm Thủy Sản An Toàn',
        certificateNumber: 'FAO-VG-TT-82-22-06',
        validUntil: new Date('2025-12-26'),
        issuedBy: 'Sở Nông nghiệp và Phát triển nông thôn Đồng Tháp'
      }
    ];
    
    await product.save();
    
    console.log('✅ Đã khôi phục thông tin:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🏭 Nhà cung cấp:', product.supplier);
    console.log('📍 Nơi trồng:', product.location);
    console.log('📦 Nơi đóng gói:', product.packingLocation);
    console.log('🏷️  Số lô:', product.lotNumber);
    console.log('📅 Ngày thu hoạch:', product.harvestDate.toLocaleDateString('vi-VN'));
    console.log('📅 Ngày đóng gói:', product.packingDate.toLocaleDateString('vi-VN'));
    console.log('📅 Ngày giao hàng:', product.deliveryDate.toLocaleDateString('vi-VN'));
    console.log('🏆 Chứng nhận:', product.certifications.length);

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

restoreProduct();
