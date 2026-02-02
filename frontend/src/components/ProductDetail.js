import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import QRCodeModal from './QRCodeModal';
import './ProductDetail.css';

function ProductDetail({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  const loadProductDetail = async () => {
    try {
      setLoading(true);
      setError('');

      // Lấy thông tin sản phẩm
      const productResponse = await api.get(`/batches/${productId}`);
      if (productResponse.data.success) {
        setProduct(productResponse.data.data);
      }

      // Lấy lịch sử truy vết
      const tracesResponse = await api.get(`/batches/${productId}/traces`);
      if (tracesResponse.data.success) {
        setTraces(tracesResponse.data.data);
      }
    } catch (err) {
      console.error('Error loading product detail:', err);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="product-detail-overlay">
        <div className="product-detail-container">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-overlay" onClick={onClose}>
        <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
          <div className="detail-header">
            <h2>❌ Lỗi</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="error-message">{error || 'Không tìm thấy sản phẩm'}</div>
          <button className="btn-close" onClick={onClose}>Đóng</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="product-detail-overlay" onClick={onClose}>
        <div className="product-detail-container" onClick={(e) => e.stopPropagation()}>
          <div className="detail-header">
            <h2>🌾 Chi Tiết Sản Phẩm</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <div className="detail-content">
            {/* Thông tin cơ bản */}
            <div className="product-info-section">
              <h3>📦 Thông tin cơ bản</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Mã sản phẩm:</span>
                  <span className="value">{product.batch_id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tên sản phẩm:</span>
                  <span className="value">{product.product_name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Loại:</span>
                  <span className="value">{product.product_type || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Trạng thái:</span>
                  <span className="value status-badge">{product.status || 'active'}</span>
                </div>
              </div>
            </div>

            {/* Thông tin nông dân */}
            <div className="product-info-section">
              <h3>👨‍🌾 Thông tin nông dân</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Mã nông dân:</span>
                  <span className="value">{product.grower_id}</span>
                </div>
                <div className="info-item">
                  <span className="label">Tên nông dân:</span>
                  <span className="value">{product.grower_name || 'Chưa cập nhật'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Địa điểm:</span>
                  <span className="value">{product.location || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </div>

            {/* Mã QR */}
            <div className="qr-section">
              <h3>📱 Mã QR Truy Xuất</h3>
              <p className="qr-description">Quét mã QR để xem lịch sử truy vết sản phẩm</p>
              <button 
                className="btn-show-qr"
                onClick={() => setShowQRModal(true)}
              >
                Hiển thị mã QR
              </button>
            </div>

            {/* Lịch sử truy vết */}
            <div className="trace-section">
              <h3>🔍 Lịch Sử Truy Vết</h3>
              {traces.length === 0 ? (
                <p className="empty-message">Chưa có lịch sử truy vết</p>
              ) : (
                <div className="trace-timeline">
                  {traces.map((trace, index) => (
                    <div key={index} className="trace-item">
                      <div className="trace-marker">
                        <div className="trace-dot"></div>
                        {index < traces.length - 1 && <div className="trace-line"></div>}
                      </div>
                      <div className="trace-card">
                        <div className="trace-header-info">
                          <span className="trace-action">{trace.action}</span>
                          <span className="trace-step">Bước {index + 1}</span>
                        </div>
                        <div className="trace-details">
                          <div className="trace-detail">
                            <span className="label">📍 Địa điểm:</span>
                            <span className="value">{trace.location}</span>
                          </div>
                          <div className="trace-detail">
                            <span className="label">👤 Người thực hiện:</span>
                            <span className="value">{trace.actor}</span>
                          </div>
                          <div className="trace-detail">
                            <span className="label">⏰ Thời gian:</span>
                            <span className="value">{formatTimestamp(trace.timestamp)}</span>
                          </div>
                          {trace.notes && (
                            <div className="trace-detail">
                              <span className="label">📝 Ghi chú:</span>
                              <span className="value">{trace.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-footer">
            <button className="btn-close" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>

      {showQRModal && (
        <QRCodeModal
          productId={product.batch_id}
          productName={product.product_name}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </>
  );
}

export default ProductDetail;
