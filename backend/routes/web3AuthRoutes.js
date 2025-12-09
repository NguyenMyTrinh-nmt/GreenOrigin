const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');

// @desc    Tạo nonce để user ký
// @route   POST /api/web3auth/request-nonce
// @access  Public
router.post('/request-nonce', async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp địa chỉ ví'
      });
    }

    // Tạo nonce ngẫu nhiên
    const nonce = `GreenOrigin-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    // Message để user ký
    const message = `Xác thực đăng nhập GreenOrigin\n\nĐịa chỉ ví: ${walletAddress}\nNonce: ${nonce}\nThời gian: ${new Date().toISOString()}`;

    res.json({
      success: true,
      data: {
        message,
        nonce,
        walletAddress
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
});

// @desc    Verify signature và đăng nhập
// @route   POST /api/web3auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin xác thực'
      });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Chữ ký không hợp lệ'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        walletAddress: walletAddress.toLowerCase(),
        type: 'web3'
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        walletAddress: walletAddress.toLowerCase(),
        token,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      error: error.message
    });
  }
});

// @desc    Lấy thông tin user từ wallet
// @route   GET /api/web3auth/me
// @access  Private
router.get('/me', async (req, res) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

    res.json({
      success: true,
      data: {
        walletAddress: decoded.walletAddress,
        type: decoded.type
      }
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ',
      error: error.message
    });
  }
});

module.exports = router;
