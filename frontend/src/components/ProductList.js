import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './ProductList.css';

function ProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?limit=1000');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      alert('✅ Xóa sản phẩm thành công!');
      loadProducts();
    } catch (err) {
      alert('❌ Lỗi khi xóa sản phẩm: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
  };

  const closeDetail = () => {
    setSelectedProduct(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>❌ {error}</p>
        <button onClick={loadProducts}>Thử lại</button>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>📦 Danh sách sản phẩm</h2>
        <span className="product-count">{products.length} sản phẩm</span>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>Chưa có sản phẩm nào</h3>
          <p>Nhấn "Thêm sản phẩm mới" để bắt đầu</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              {product.imageUrl && (
                <div className="product-image">
                  <img 
                    src={`http://localhost:5000${product.imageUrl}`} 
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="product-header">
                <span className="product-badge">{product.category}</span>
                <span className={`status-badge ${product.status}`}>
                  {product.status === 'active' ? '✅' : '❌'}
                </span>
              </div>

              <div className="product-body">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-id">ID: {product.productId}</p>
                
                <div className="product-info">
                  <div className="info-item">
                    <span className="label">👨‍🌾 Nông dân:</span>
                    <span className="value">{product.farmerName || product.farmerId}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">📍 Địa điểm:</span>
                    <span className="value">{product.location || 'N/A'}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">📅 Thu hoạch:</span>
                    <span className="value">{formatDate(product.harvestDate)}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="label">📊 Số lượng:</span>
                    <span className="value">{product.quantity || 0} {product.unit}</span>
                  </div>
                </div>

                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
              </div>

              <div className="product-footer">
                <button 
                  className="btn-view"
                  onClick={() => handleViewDetail(product)}
                >
                  👁️ Xem
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(product._id)}
                >
                  🗑️ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <div className="modal-overlay" onClick={closeDetail}>
          <div className="modal-detail" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🌾 Chi tiết sản phẩm</h2>
              <button className="close-button" onClick={closeDetail}>✕</button>
            </div>

            <div className="detail-content">
              {selectedProduct.imageUrl && (
                <div className="detail-image">
                  <img 
                    src={`http://localhost:5000${selectedProduct.imageUrl}`} 
                    alt={selectedProduct.name}
                  />
                </div>
              )}

              <div className="detail-section">
                <h3>Thông tin cơ bản</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Mã sản phẩm:</span>
                    <span className="value">{selectedProduct.productId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tên sản phẩm:</span>
                    <span className="value">{selectedProduct.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Loại:</span>
                    <span className="value">{selectedProduct.category}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Trạng thái:</span>
                    <span className="value">{selectedProduct.status}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin nông dân</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Mã nông dân:</span>
                    <span className="value">{selectedProduct.farmerId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Tên nông dân:</span>
                    <span className="value">{selectedProduct.farmerName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Địa điểm:</span>
                    <span className="value">{selectedProduct.location || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Thông tin thu hoạch</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Ngày thu hoạch:</span>
                    <span className="value">{formatDate(selectedProduct.harvestDate)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Số lượng:</span>
                    <span className="value">{selectedProduct.quantity} {selectedProduct.unit}</span>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="detail-section">
                  <h3>Mô tả</h3>
                  <p className="description-text">{selectedProduct.description}</p>
                </div>
              )}

              <div className="detail-section">
                <h3>Thông tin hệ thống</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Tạo bởi:</span>
                    <span className="value monospace">{selectedProduct.createdBy}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Ngày tạo:</span>
                    <span className="value">{formatDate(selectedProduct.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
