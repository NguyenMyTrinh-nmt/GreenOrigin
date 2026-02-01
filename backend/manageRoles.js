require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/greenorigin';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    console.error('💡 Kiểm tra: MongoDB có đang chạy không? Hoặc kiểm tra MONGODB_URI trong file .env');
    process.exit(1);
  }
};

// Cập nhật role cho user
const updateUserRole = async (identifier, newRole) => {
  try {
    await connectDB();

    const validRoles = ['CONSUMER', 'GROWER', 'TRANSPORTER', 'VERIFIER', 'ADMIN'];
    
    if (!validRoles.includes(newRole)) {
      console.log('❌ Role không hợp lệ!');
      console.log('Các role hợp lệ:', validRoles.join(', '));
      process.exit(1);
    }

    // Tìm user theo wallet address hoặc username
    const query = identifier.startsWith('0x') 
      ? { walletAddress: identifier.toLowerCase() }
      : { username: identifier };

    const user = await User.findOneAndUpdate(
      query,
      { role: newRole },
      { new: true }
    );

    if (user) {
      console.log('\n✅ Đã cập nhật role thành công!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('👤 Username:', user.username);
      console.log('💼 Role:', user.role);
      console.log('👛 Wallet:', user.walletAddress || 'N/A');
      console.log('📧 Email:', user.email || 'N/A');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 Lưu ý: User cần đăng xuất và đăng nhập lại để role có hiệu lực!');
    } else {
      console.log('\n❌ Không tìm thấy user với:', identifier);
      
      // Hiển thị tất cả users
      const allUsers = await User.find({});
      console.log('\n📋 Danh sách tất cả users trong hệ thống:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      allUsers.forEach(u => {
        console.log(`👤 ${u.username.padEnd(20)} | ${u.role.padEnd(12)} | ${u.walletAddress || 'no wallet'}`);
      });
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Hiển thị tất cả users
const listAllUsers = async () => {
  try {
    await connectDB();

    const users = await User.find({}).sort({ createdAt: 1 });
    
    console.log('\n📋 Danh sách tất cả users trong hệ thống:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username'.padEnd(20), '| Role'.padEnd(13), '| Wallet Address');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    users.forEach(u => {
      console.log(
        u.username.padEnd(20),
        `| ${u.role}`.padEnd(13),
        `| ${u.walletAddress || 'no wallet'}`
      );
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\nTổng: ${users.length} users`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log('\n🔐 Script quản lý Role - GreenOrigin\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📖 Cách sử dụng:\n');
  console.log('1. Hiển thị tất cả users:');
  console.log('   node manageRoles.js --list\n');
  console.log('2. Cập nhật role cho user (theo wallet address):');
  console.log('   node manageRoles.js <wallet_address> <role>\n');
  console.log('3. Cập nhật role cho user (theo username):');
  console.log('   node manageRoles.js <username> <role>\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💼 Các role hợp lệ:');
  console.log('   • CONSUMER    - Người tiêu dùng (chỉ xem)');
  console.log('   • GROWER      - Nông hộ (tạo sản phẩm)');
  console.log('   • TRANSPORTER - Vận chuyển');
  console.log('   • VERIFIER    - Kiểm định');
  console.log('   • ADMIN       - Quản trị viên (toàn quyền)');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📝 Ví dụ:\n');
  console.log('   node manageRoles.js --list');
  console.log('   node manageRoles.js 0x1234...5678 ADMIN');
  console.log('   node manageRoles.js farmer01 GROWER');
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(0);
}

// Xử lý commands
if (args[0] === '--list' || args[0] === '-l') {
  listAllUsers();
} else if (args.length === 2) {
  const identifier = args[0];
  const role = args[1].toUpperCase();
  updateUserRole(identifier, role);
} else {
  console.log('❌ Sai cú pháp!');
  console.log('Sử dụng: node manageRoles.js --help để xem hướng dẫn');
  process.exit(1);
}
