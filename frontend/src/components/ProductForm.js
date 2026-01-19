import React, { useState } from 'react';
import api from '../utils/api';
import './ProductForm.css';

function ProductForm({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: 'rau',
    description: '',
    farmerId: '',
    farmerName: '',
    location: '',
    harvestDate: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'kg'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước file phải nhỏ hơn 5MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      
      // Thêm tất cả các field từ formData
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Thêm file ảnh nếu có
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      const response = await api.post('/products', submitData);
      
      if (response.data.success) {
        alert('✅ Thêm sản phẩm thành công!');
        onSuccess && onSuccess(response.data.data);
        onClose && onClose();
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Thêm sản phẩm mới</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="error-alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Hình ảnh sản phẩm</label>
            <div className="image-upload-section">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload" className="image-upload-label">
                {imagePreview ? (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                    <div className="image-overlay">
                      <span>📷 Đổi ảnh</span>
                    </div>
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <span className="upload-icon">📷</span>
                    <p>Click để chọn ảnh</p>
                    <small>JPG, PNG, GIF (Max 5MB)</small>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mã sản phẩm *</label>
              <input
                type="text"
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                placeholder="SP001"
                required
              />
            </div>

            <div className="form-group">
              <label>Tên sản phẩm *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Rau cải xanh"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Loại sản phẩm</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="rau">Rau</option>
                <option value="củ">Củ</option>
                <option value="quả">Quả</option>
                <option value="ngũ cốc">Ngũ cốc</option>
                <option value="hạt">Hạt</option>
                <option value="khác">Khác</option>
              </select>
            </div>

            <div className="form-group">
              <label>Mã nông dân *</label>
              <input
                type="text"
                name="farmerId"
                value={formData.farmerId}
                onChange={handleChange}
                placeholder="ND001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tên nông dân</label>
              <input
                type="text"
                name="farmerName"
                value={formData.farmerName}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="form-group">
              <label>Địa điểm</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Đà Lạt, Lâm Đồng"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả chi tiết về sản phẩm..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày thu hoạch</label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Số lượng</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Đơn vị</label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                <option value="kg">Kg</option>
                <option value="tấn">Tấn</option>
                <option value="bó">Bó</option>
                <option value="quả">Quả</option>
                <option value="thùng">Thùng</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Đang xử lý...' : '✅ Thêm sản phẩm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
