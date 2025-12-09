require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const web3AuthRoutes = require('./routes/web3AuthRoutes');

// Khởi tạo app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GreenOrigin API Server - Web3 Authentication',
    version: '1.0.0',
    endpoints: {
      'POST /api/web3auth/request-nonce': 'Lấy message để ký',
      'POST /api/web3auth/verify': 'Xác thực signature và đăng nhập',
      'GET /api/web3auth/me': 'Lấy thông tin user'
    }
  });
});

app.use('/api/web3auth', web3AuthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route không tồn tại'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API: http://localhost:${PORT}`);
  console.log(`✅ Web3 Authentication Ready (Không cần MongoDB)`);
});
