require('dotenv').config();
const axios = require('axios');

async function testAPI() {
  try {
    console.log('🧪 Testing API /batches/SP0030...\n');
    
    const response = await axios.get('http://localhost:5000/api/batches/SP0030');
    
    if (response.data.success) {
      const product = response.data.data;
      
      console.log('✅ API Response:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Mã sản phẩm:', product.productId);
      console.log('📝 Tên:', product.name);
      console.log('🏭 Nhà cung cấp:', product.supplier || 'Chưa cập nhật');
      console.log('📍 Nơi trồng:', product.location || 'Chưa cập nhật');
      console.log('📦 Nơi đóng gói:', product.packingLocation || 'Chưa cập nhật');
      console.log('🏷️  Số lô:', product.lotNumber || 'Chưa cập nhật');
      console.log('📅 Ngày thu hoạch:', product.harvestDate || 'Chưa cập nhật');
      console.log('📅 Ngày đóng gói:', product.packingDate || 'Chưa cập nhật');
      console.log('📅 Ngày giao hàng:', product.deliveryDate || 'Chưa cập nhật');
      console.log('🏆 Số chứng nhận:', product.certifications?.length || 0);
      console.log('🔗 Nguồn dữ liệu:', response.data.source);
      console.log('');
      
      if (product.certifications && product.certifications.length > 0) {
        console.log('🏆 Chi tiết chứng nhận:');
        product.certifications.forEach((cert, idx) => {
          console.log(`  ${idx + 1}. ${cert.name}`);
          console.log(`     Mã số: ${cert.certificateNumber}`);
          console.log(`     Hết hạn: ${cert.validUntil}`);
        });
      }
      
      console.log('\n✅ Test thành công!');
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAPI();
