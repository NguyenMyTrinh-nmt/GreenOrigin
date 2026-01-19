const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Yêu cầu authentication
exports.protect = async (req, res, next) => {
  let token;

  // Kiểm tra token trong header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ token (không bao gồm password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Không tìm thấy người dùng'
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: 'Không có quyền truy cập, token không hợp lệ'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Không có quyền truy cập, không có token'
    });
  }
};

// Authorize roles - Phân quyền theo role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Vai trò ${req.user.role} không có quyền truy cập`
      });
    }
    next();
  };
};
