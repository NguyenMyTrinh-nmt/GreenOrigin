const mongoose = require('mongoose');
const Product = require('./models/Product');
const ProductUpdate = require('./models/ProductUpdate');

const MONGO_URI = 'mongodb+srv://greenorigin:Khoi123456@greenorigin.cm1cqcj.mongodb.net/greenorigin?retryWrites=true&w=majority';

async function deleteAllProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Đếm số lượng trước khi xóa
    const productCount = await Product.countDocuments();
    const updateCount = await ProductUpdate.countDocuments();
    
    console.log(`\n📊 Hiện có:`);
    console.log(`   - ${productCount} sản phẩm trong Product collection`);
    console.log(`   - ${updateCount} bản ghi lịch sử trong ProductUpdate collection`);

    if (productCount === 0 && updateCount === 0) {
      console.log('\n✅ Không có dữ liệu cần xóa!');
      process.exit(0);
    }

    // Xóa tất cả products
    const deleteProductResult = await Product.deleteMany({});
    console.log(`\n🗑️  Đã xóa ${deleteProductResult.deletedCount} sản phẩm từ Product collection`);

    // Xóa tất cả product updates
    const deleteUpdateResult = await ProductUpdate.deleteMany({});
    console.log(`🗑️  Đã xóa ${deleteUpdateResult.deletedCount} bản ghi lịch sử từ ProductUpdate collection`);

    console.log('\n✅ Hoàn thành! Tất cả sản phẩm đã được xóa khỏi database.');
    console.log('\n⚠️  LƯU Ý: Dữ liệu trên blockchain KHÔNG thể xóa (immutable).');
    console.log('   Blockchain vẫn giữ thông tin các sản phẩm đã thêm trước đó.');
    console.log('   Bạn có thể thêm lại sản phẩm với cùng productId vào database.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

deleteAllProducts();
