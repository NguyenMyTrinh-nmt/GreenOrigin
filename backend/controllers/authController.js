const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Đăng ký user mới
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, walletAddress, phoneNumber, address } = req.body;

    // Kiểm tra user đã tồn tại
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'farmer',
      walletAddress,
      phoneNumber,
      address
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          walletAddress: user.walletAddress,
          token: generateToken(user._id)
        }
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Đăng nhập
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu'
      });
    }

    // Kiểm tra user (bao gồm password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        token: generateToken(user._id)
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
};

// @desc    Lấy thông tin user hiện tại
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật thông tin user
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      walletAddress: req.body.walletAddress
    };

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Verify wallet address
// @route   POST /api/auth/verify-wallet
// @access  Private
exports.verifyWallet = async (req, res) => {
  try {
    const { walletAddress, signature } = req.body;

    // TODO: Verify signature với ethers.js
    // const message = `Xác thực ví MetaMask cho tài khoản ${req.user.email}`;
    // const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Chữ ký không hợp lệ'
    //   });
    // }

    // Cập nhật wallet address
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { walletAddress: walletAddress.toLowerCase(), isVerified: true },
      { new: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Xác thực ví thành công'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
