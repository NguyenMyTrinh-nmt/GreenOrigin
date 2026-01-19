const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const LoginHistory = require('../models/LoginHistory');

// Lưu trữ tạm thời nonce (trong production nên dùng Redis)
const nonceStore = new Map();

// Tạo nonce cho wallet address
exports.requestNonce = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }

    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }

    // Tạo nonce ngẫu nhiên
    const nonce = crypto.randomBytes(32).toString('hex');
    const timestamp = Date.now();
    
    // Tạo message để ký
    const message = `Welcome to GreenOrigin!\n\nSign this message to verify your wallet ownership.\n\nWallet: ${walletAddress}\nNonce: ${nonce}\nTimestamp: ${timestamp}`;

    // Lưu nonce với thời gian hết hạn 5 phút
    nonceStore.set(walletAddress.toLowerCase(), {
      nonce,
      message,
      timestamp,
      expiresAt: timestamp + 5 * 60 * 1000 // 5 minutes
    });

    // Xóa nonce cũ sau 5 phút
    setTimeout(() => {
      nonceStore.delete(walletAddress.toLowerCase());
    }, 5 * 60 * 1000);

    return res.status(200).json({
      success: true,
      message: 'Nonce generated successfully',
      data: {
        message,
        nonce,
        timestamp
      }
    });
  } catch (error) {
    console.error('requestNonce error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate nonce',
      error: error.message
    });
  }
};

// Verify signature và tạo JWT token
exports.verifySignature = async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address, signature, and message are required'
      });
    }

    // Validate wallet address format
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }

    const normalizedAddress = walletAddress.toLowerCase();

    // Kiểm tra nonce tồn tại và chưa hết hạn
    const storedData = nonceStore.get(normalizedAddress);
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Nonce not found or expired. Please request a new nonce.'
      });
    }

    if (Date.now() > storedData.expiresAt) {
      nonceStore.delete(normalizedAddress);
      return res.status(400).json({
        success: false,
        message: 'Nonce has expired. Please request a new nonce.'
      });
    }

    if (storedData.message !== message) {
      return res.status(400).json({
        success: false,
        message: 'Message mismatch'
      });
    }

    // Verify signature
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      if (recoveredAddress.toLowerCase() !== normalizedAddress) {
        return res.status(401).json({
          success: false,
          message: 'Invalid signature'
        });
      }
    } catch (error) {
      console.error('Signature verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid signature format'
      });
    }

    // Xóa nonce đã sử dụng
    nonceStore.delete(normalizedAddress);

    // Tạo JWT token
    const token = jwt.sign(
      { 
        walletAddress: normalizedAddress,
        type: 'web3'
      },
      process.env.JWT_SECRET || 'greenorigin_secret_key_2025_metamask',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Lưu lịch sử đăng nhập
    try {
      await LoginHistory.create({
        walletAddress: normalizedAddress,
        loginTime: new Date(),
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        status: 'success',
        message: 'Web3 login successful'
      });
    } catch (historyError) {
      console.error('Failed to save login history:', historyError);
      // Không fail login nếu lưu lịch sử bị lỗi
    }

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: {
        token,
        walletAddress: normalizedAddress,
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    });
  } catch (error) {
    console.error('verifySignature error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify signature',
      error: error.message
    });
  }
};

// Cleanup expired nonces periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [address, data] of nonceStore.entries()) {
    if (now > data.expiresAt) {
      nonceStore.delete(address);
    }
  }
}, 10 * 60 * 1000);
