import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './ProductUpdateForm.css';

function ProductUpdateForm({ productId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    supplier: '',
    location: '',
    packingLocation: '',
    lotNumber: '',
    harvestDate: '',
    packingDate: '',
    deliveryDate: '',
    certifications: []
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadProductData();
  }, [productId]);

  const loadProductData = async () => {
    try {
      setLoadingData(true);
      const response = await api.get(`/batches/${productId}`);
      if (response.data.success) {
        const product = response.data.data;
        setFormData({
          name: product.name || '',
          supplier: product.supplier || '',
          location: product.location || '',
          packingLocation: product.packingLocation || '',
          lotNumber: product.lotNumber || productId,
          harvestDate: product.harvestDate ? new Date(product.harvestDate).toISOString().split('T')[0] : '',
          packingDate: product.packingDate ? new Date(product.packingDate).toISOString().split('T')[0] : '',
          deliveryDate: product.deliveryDate ? new Date(product.deliveryDate).toISOString().split('T')[0] : '',
          certifications: product.certifications || []
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Không thể tải thông tin sản phẩm');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationChange = (index, field, value) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      certifications: newCertifications
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        {
          name: '',
          standard: '',
          certificateNumber: '',
          validUntil: '',
          issuedBy: ''
        }
      ]
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Tên sản phẩm, Nơi trồng)');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/products/by-product-id/${productId}`, formData);
      
      if (response.data.success) {
        alert('✅ Cập nhật thông tin sản phẩm thành công!');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('❌ Lỗi: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="modal-overlay">
        <div className="product-update-form">
          <div className="form-header">
            <h2>📝 Cập Nhật Thông Tin Sản Phẩm</h2>
            <button className="btn-close" onClick={onClose}>✕</button>
          </div>
          <div className="loading-state">Đang tải...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="product-update-form">
        <div className="form-header">
          <h2>📝 Cập Nhật Thông Tin Sản Phẩm</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input 
                type="text" 
                value={productId}
                disabled
                className="input-disabled"
              />
            </div>

            <div className="form-group">
              <label>Tên sản phẩm <span className="required">*</span></label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ví dụ: Xoài Cát Chu Vàng"
                required
              />
            </div>

            <div className="form-group">
              <label>Nhà cung cấp</label>
              <input 
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Ví dụ: HKD Nguyễn Văn Thi"
              />
            </div>

            <div className="form-group">
              <label>Nơi trồng <span className="required">*</span></label>
              <input 
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ví dụ: Ấp 3, Xã Thanh Hưng, Đông Thấp"
                required
              />
            </div>

            <div className="form-group">
              <label>Nơi đóng gói</label>
              <input 
                type="text"
                name="packingLocation"
                value={formData.packingLocation}
                onChange={handleChange}
                placeholder="Ví dụ: Ấp 2, Xã An Hữu, Đông Thấp"
              />
            </div>

            <div className="form-group">
              <label>Số thửa/lô sản phẩm</label>
              <input 
                type="text"
                name="lotNumber"
                value={formData.lotNumber}
                onChange={handleChange}
                placeholder="Ví dụ: Thanh Hưng - Khu 03 - Xoài Cát Chu Vàng"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin ngày tháng</h3>
            
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
                <label>Ngày đóng gói</label>
                <input 
                  type="date"
                  name="packingDate"
                  value={formData.packingDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Ngày giao hàng</label>
                <input 
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Chứng nhận sản phẩm</h3>
              <button type="button" className="btn-add-cert" onClick={addCertification}>
                ➕ Thêm chứng nhận
              </button>
            </div>

            {formData.certifications.map((cert, index) => (
              <div key={index} className="certification-item">
                <div className="cert-header">
                  <span>Chứng nhận {index + 1}</span>
                  <button 
                    type="button" 
                    className="btn-remove-cert"
                    onClick={() => removeCertification(index)}
                  >
                    🗑️ Xóa
                  </button>
                </div>

                <div className="form-group">
                  <label>Tiêu chuẩn</label>
                  <input 
                    type="text"
                    value={cert.name || ''}
                    onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                    placeholder="Ví dụ: VietGAP"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả tiêu chuẩn</label>
                  <input 
                    type="text"
                    value={cert.standard || ''}
                    onChange={(e) => handleCertificationChange(index, 'standard', e.target.value)}
                    placeholder="Ví dụ: Bản Cam Kết, Sản Xuất, Kinh Doanh Thực Phẩm An Toàn"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Mã số giấy chứng nhận</label>
                    <input 
                      type="text"
                      value={cert.certificateNumber || ''}
                      onChange={(e) => handleCertificationChange(index, 'certificateNumber', e.target.value)}
                      placeholder="Ví dụ: FAO-VG-TT-82-22-06"
                    />
                  </div>

                  <div className="form-group">
                    <label>Có hiệu lực đến</label>
                    <input 
                      type="date"
                      value={cert.validUntil ? new Date(cert.validUntil).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleCertificationChange(index, 'validUntil', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cơ quan cấp</label>
                  <input 
                    type="text"
                    value={cert.issuedBy || ''}
                    onChange={(e) => handleCertificationChange(index, 'issuedBy', e.target.value)}
                    placeholder="Ví dụ: Sở Nông nghiệp và Phát triển nông thôn Đồng Tháp"
                  />
                </div>
              </div>
            ))}

            {formData.certifications.length === 0 && (
              <p className="no-certifications">Chưa có chứng nhận nào. Bấm "Thêm chứng nhận" để thêm.</p>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Đang cập nhật...' : '💾 Cập Nhật Thông Tin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductUpdateForm;
