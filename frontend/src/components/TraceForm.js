import React, { useState } from 'react';
import api from '../utils/api';
import './TraceForm.css';

function TraceForm({ onClose, onSuccess, productId: initialProductId = '' }) {
  const [formData, setFormData] = useState({
    productId: initialProductId,
    action: '',
    location: ''
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
      const response = await api.post(
        `/batches/${formData.productId}/traces`,
        {
          action: formData.action,
          location: formData.location
        }
      );

      if (response.data.success) {
        alert('Thêm bước truy vết thành công!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error('Error adding trace:', err);
      setError(err.response?.data?.message || 'Không thể thêm bước truy vết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Thêm Bước Truy Vết</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="trace-form">
          {error && <div className="error-message">{error}</div>}

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
              disabled={!!initialProductId}
            />
          </div>

          <div className="form-group">
            <label htmlFor="action">
              Hành Động <span className="required">*</span>
            </label>
            <select
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hành động --</option>
              <option value="Thu hoạch">Thu hoạch</option>
              <option value="Đóng gói">Đóng gói</option>
              <option value="Vận chuyển">Vận chuyển</option>
              <option value="Kiểm tra chất lượng">Kiểm tra chất lượng</option>
              <option value="Nhập kho">Nhập kho</option>
              <option value="Xuất kho">Xuất kho</option>
              <option value="Phân phối">Phân phối</option>
              <option value="Bán lẻ">Bán lẻ</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Địa Điểm <span className="required">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ví dụ: Nông trại ABC, Đồng Nai"
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
              {loading ? 'Đang xử lý...' : 'Thêm Bước Truy Vết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TraceForm;
