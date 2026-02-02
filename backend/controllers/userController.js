const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load users',
      error: error.message
    });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, role, email, walletAddress } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Username, password và role là bắt buộc'
      });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      passwordHash,
      role,
      email,
      walletAddress
    });

    const userSafe = user.toObject();
    delete userSafe.passwordHash;

    return res.status(201).json({
      success: true,
      message: 'Tạo người dùng thành công',
      data: userSafe
    });
  } catch (error) {
    console.error('createUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, role, email, walletAddress } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    if (role) user.role = role;
    if (email !== undefined) user.email = email;
    if (walletAddress !== undefined) user.walletAddress = walletAddress;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await user.save();

    const userSafe = user.toObject();
    delete userSafe.passwordHash;

    return res.status(200).json({
      success: true,
      message: 'Cập nhật người dùng thành công',
      data: userSafe
    });
  } catch (error) {
    console.error('updateUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đã xóa người dùng'
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};
