const mongoose = require('mongoose');
require('dotenv').config();

const fixEmailIndex = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.connection.collection('users');
    
    // Xóa index email cũ
    try {
      await User.dropIndex('email_1');
      console.log('✅ Dropped email_1 index');
    } catch (error) {
      console.log('⚠️  email_1 index không tồn tại hoặc đã bị xóa');
    }
    
    // Tạo index email mới (sparse - cho phép nhiều null/empty)
    await User.createIndex({ email: 1 }, { sparse: true });
    console.log('✅ Created new email index (sparse)');
    
    // Hiển thị thống kê
    const totalUsers = await User.countDocuments();
    const emptyEmailUsers = await User.countDocuments({ email: '' });
    console.log(`\n📊 Thống kê:`);
    console.log(`   - Tổng users: ${totalUsers}`);
    console.log(`   - Users có email rỗng: ${emptyEmailUsers}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Hoàn thành! Bây giờ có thể thêm user mới.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixEmailIndex();
