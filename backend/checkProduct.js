require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkProductInfo() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Tìm sản phẩm Thanh Long
    const products = await Product.find({ 
      name: { $regex: /thanh long/i } 
    });

    if (products.length === 0) {
      console.log('❌ Không tìm thấy sản phẩm Thanh Long');
      await mongoose.connection.close();
      return;
    }

    console.log(`📦 Tìm thấy ${products.length} sản phẩm:\n`);

    products.forEach(product => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Mã sản phẩm:', product.productId);
      console.log('📝 Tên:', product.name);
      console.log('🏭 Nhà cung cấp:', product.supplier || 'Chưa có');
      console.log('📍 Nơi trồng:', product.location || 'Chưa có');
      console.log('📦 Nơi đóng gói:', product.packingLocation || 'Chưa có');
      console.log('🏷️  Số lô:', product.lotNumber || 'Chưa có');
      console.log('📅 Ngày thu hoạch:', product.harvestDate ? product.harvestDate.toLocaleDateString('vi-VN') : 'Chưa có');
      console.log('📅 Ngày đóng gói:', product.packingDate ? product.packingDate.toLocaleDateString('vi-VN') : 'Chưa có');
      console.log('📅 Ngày giao hàng:', product.deliveryDate ? product.deliveryDate.toLocaleDateString('vi-VN') : 'Chưa có');
      console.log('🏆 Số chứng nhận:', product.certifications ? product.certifications.length : 0);
      
      if (product.certifications && product.certifications.length > 0) {
        console.log('\n🏆 Chứng nhận:');
        product.certifications.forEach((cert, idx) => {
          console.log(`  ${idx + 1}. ${cert.name} - ${cert.certificateNumber}`);
        });
      }
      console.log('');
    });

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkProductInfo();
