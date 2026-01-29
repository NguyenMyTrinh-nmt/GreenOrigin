import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'GROWER',
    email: '',
    walletAddress: ''
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'GROWER',
      email: '',
      walletAddress: ''
    });
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      email: user.email || '',
      walletAddress: user.walletAddress || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?`)) return;
    try {
      await api.delete(`/users/${user._id}`);
      loadUsers();
    } catch (err) {
      alert('Không thể xóa người dùng');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser._id}`, {
          password: formData.password || undefined,
          role: formData.role,
          email: formData.email,
          walletAddress: formData.walletAddress
        });
      } else {
        await api.post('/users', formData);
      }
      setShowForm(false);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lưu người dùng');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={loadUsers}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="user-list-container">
      <div className="list-header">
        <h2>👥 Quản lý người dùng</h2>
        <button className="btn-primary" onClick={openCreateForm}>➕ Thêm người dùng</button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <p>Chưa có người dùng nào</p>
        </div>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Ví liên kết</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.email || '—'}</td>
                <td>{user.walletAddress || '—'}</td>
                <td>
                  <button onClick={() => openEditForm(user)}>Sửa</button>
                  <button onClick={() => handleDelete(user)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="user-form-modal" onClick={e => e.stopPropagation()}>
            <h3>{editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!!editingUser}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu {editingUser ? '(để trống nếu không đổi)' : ''}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label>Vai trò</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="GROWER">Nông hộ (GROWER)</option>
                  <option value="TRANSPORTER">Vận chuyển (TRANSPORTER)</option>
                  <option value="VERIFIER">Kiểm định (VERIFIER)</option>
                  <option value="CONSUMER">Người tiêu dùng (CONSUMER)</option>
                  <option value="ADMIN">Quản trị (ADMIN)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ ví (nếu có)</label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
