const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const authorizeRole = require('../middleware/authorizeRole');

// Chỉ ADMIN mới được quản lý người dùng
router.get('/', auth, authorizeRole('ADMIN'), getUsers);

router.post('/', auth, authorizeRole('ADMIN'), createUser);

router.put('/:id', auth, authorizeRole('ADMIN'), updateUser);

router.delete('/:id', auth, authorizeRole('ADMIN'), deleteUser);

module.exports = router;
