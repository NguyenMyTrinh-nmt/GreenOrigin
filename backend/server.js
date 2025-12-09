// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/database');

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const productRoutes = require('./routes/productRoutes');
// const traceabilityRoutes = require('./routes/traceabilityRoutes');

// // Khởi tạo app
// const app = express();

// // Kết nối database
// connectDB();

// // Middleware
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'GreenOrigin API Server',
//     version: '1.0.0'
//   });
// });

// app.use('/api/auth', authRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/traceability', traceabilityRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Lỗi server',
//     error: process.env.NODE_ENV === 'development' ? err : {}
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route không tồn tại'
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server đang chạy trên port ${PORT}`);
//   console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const traceabilityRoutes = require('./routes/traceabilityRoutes');
const web3AuthRoutes = require('./routes/web3AuthRoutes');

// Khởi tạo app
const app = express();

// Kết nối database
connectDB();

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
    message: 'GreenOrigin API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      web3auth: '/api/web3auth',
      products: '/api/products',
      traceability: '/api/traceability'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/web3auth', web3AuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/traceability', traceabilityRoutes);

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
  console.log(`Server đang chạy trên port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});