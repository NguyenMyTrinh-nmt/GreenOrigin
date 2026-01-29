import React, { useState } from 'react';
import api from '../utils/api';
import './BatchProductForm.css';

function BatchProductForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    farm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/batches/products', formData);

      if (response.data.success) {
        alert(`Thêm sản phẩm thành công vào blockchain!\n\nTransaction Hash: ${response.data.data.transactionHash}`);
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Không thể thêm sản phẩm vào blockchain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🌾 Thêm Sản Phẩm vào Blockchain</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="batch-product-form">
          {error && <div className="error-message">{error}</div>}

          <div className="info-box">
            <strong>ℹ️ Lưu ý:</strong> Bạn cần thêm sản phẩm vào blockchain trước khi có thể thêm các bước truy vết cho sản phẩm đó.
          </div>

          <div className="form-group">
            <label htmlFor="productId">
              Mã Sản Phẩm <span className="required">*</span>
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="Ví dụ: SP001"
              required
            />
            <small>Mã này sẽ được sử dụng để truy vết sau này</small>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Tên Sản Phẩm <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Gạo ST25"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="farm">
              Nông Trại / Nơi Sản Xuất <span className="required">*</span>
            </label>
            <input
              type="text"
              id="farm"
              name="farm"
              value={formData.farm}
              onChange={handleChange}
              placeholder="Ví dụ: Nông trại Xanh, Đồng Nai"
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Thêm vào Blockchain'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BatchProductForm;
