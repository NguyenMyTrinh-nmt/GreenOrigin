const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No token provided. Header:', authHeader);
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'greenorigin_secret_key_2025_metamask'
      );
      
      console.log('✅ Token verified. User role:', decoded.role);

      // Gắn thông tin user vào request (hỗ trợ cả web3 và account login)
      req.user = {
        walletAddress: decoded.walletAddress,
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role || 'ADMIN', // tạm thời mặc định ADMIN nếu không có (web3 login)
        type: decoded.type
      };

      next();
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired. Please login again.'
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Authorization denied.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication',
      error: error.message
    });
  }
};

module.exports = auth;
