const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// -----------------------------
// 🔗 KẾT NỐI MONGODB
// -----------------------------
const connectDB = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greenorigin';
    
    console.log('🔄 Đang kết nối MongoDB...');
    
    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 8000,
            family: 4 // force IPv4 to avoid DNS/SRV IPv6 issues
        });
        console.log("✅ MongoDB connected successfully!");
        return true;
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        console.log('⚠️  Server sẽ tiếp tục chạy, nhưng các tính năng database sẽ không khả dụng');
        console.log('💡 Để kết nối MongoDB:');
        console.log('   1. Whitelist IP của bạn trên MongoDB Atlas (0.0.0.0/0 cho dev)');
        console.log('   2. Hoặc cài MongoDB local và đổi MONGO_URI=mongodb://127.0.0.1:27017/greenorigin');
        return false;
    }
};

connectDB();

// -----------------------------------
// API TEST
// -----------------------------------
app.get("/", (req, res) => {
    res.json({ message: "Server is running..." });
});

// -----------------------------------
// START SERVER
// -----------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
