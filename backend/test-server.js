require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/web3auth/request-nonce', (req, res) => {
  const { walletAddress } = req.body;
  const nonce = `GreenOrigin-${Date.now()}`;
  const message = `Xác thực đăng nhập GreenOrigin\n\nĐịa chỉ ví: ${walletAddress}\nNonce: ${nonce}`;
  
  res.json({
    success: true,
    data: { message, nonce, walletAddress }
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`✅ Test server running on port ${PORT}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
});
