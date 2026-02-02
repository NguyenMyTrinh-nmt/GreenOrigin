// Yêu cầu thư viện Mongoose
const mongoose = require('mongoose');

// Định nghĩa cấu trúc Schema cho Metadata của Lô hàng
const BatchMetadataSchema = new mongoose.Schema({
    // ID lô hàng (PHẢI TRÙNG VỚI ID ĐƯỢC GHI TRÊN BLOCKCHAIN)
    batch_id: {
        type: String,
        required: true,
        unique: true
    },
    product_name: {
        type: String,
        required: true
    },
    // Hash của giao dịch gần nhất (Để xác minh dữ liệu)
    latest_transaction_hash: {
        type: String,
        required: true
    },
    // Liên kết với bảng Users (Khóa ngoại ảo trong MongoDB)
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Tham chiếu đến Model User
    },
    image_url: {
        type: String
    },
    description: {
        type: String
    },
    qr_code_url: {
        type: String
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// Xuất ra Model
module.exports = mongoose.model('BatchMetadata', BatchMetadataSchema);
