// Yêu cầu thư viện Mongoose
const mongoose = require('mongoose');

// Định nghĩa cấu trúc Schema cho User
const UserSchema = new mongoose.Schema({
    // user_id sẽ là _id mặc định của MongoDB
    
    username: {
        type: String,
        required: true, // Bắt buộc
        unique: true   // Phải là duy nhất
    },
    password_hash: {
        type: String,
        required: true
        // Trong Back-end, trước khi lưu, bạn phải Hash mật khẩu (ví dụ: dùng bcrypt)
    },
    role: {
        type: String,
        required: true,
        // Chỉ chấp nhận các giá trị này (Giúp kiểm soát quyền)
        enum: ['GROWER', 'TRANSPORTER', 'VERIFIER', 'ADMIN'] 
    },
    email: {
        type: String,
        trim: true // Loại bỏ khoảng trắng thừa
    },
    // Tự động thêm trường createdAt và updatedAt
    timestamps: true 
});

// Xuất ra Model để sử dụng trong Back-end
module.exports = mongoose.model('User', UserSchema);