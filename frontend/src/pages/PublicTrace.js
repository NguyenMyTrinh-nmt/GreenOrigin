import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import './PublicTrace.css';

function PublicTrace() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [traces, setTraces] = useState([]);
  const [updateHistory, setUpdateHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOnBlockchain, setIsOnBlockchain] = useState(true);

  useEffect(() => {
    loadProductInfo();
  }, [productId]);

  const loadProductInfo = async () => {
    try {
      setLoading(true);
      setError('');

      // Lấy thông tin sản phẩm
      const productResponse = await api.get(`/batches/${productId}`);
      if (productResponse.data.success) {
        setProduct(productResponse.data.data);
        // Kiểm tra blockchain status từ data.isOnBlockchain hoặc data.source
        const blockchainStatus = productResponse.data.data.isOnBlockchain || 
                                 productResponse.data.source === 'blockchain+database' ||
                                 productResponse.data.source === 'blockchain';
        setIsOnBlockchain(blockchainStatus);
      }

      // Lấy lịch sử truy vết
      const tracesResponse = await api.get(`/batches/${productId}/traces`);
      if (tracesResponse.data.success) {
        setTraces(tracesResponse.data.data);
      }
    } catch (err) {
      console.error('Error loading product info:', err);
      setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="public-trace-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-trace-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Không thể tải thông tin</h2>
          <p>{error}</p>
          <button onClick={loadProductInfo} className="btn-retry">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="public-trace-container">
        <div className="error-state">
          <div className="error-icon">🔍</div>
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Mã sản phẩm: {productId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="public-trace-container">
      <header className="public-header">
        <h1 className="main-title">Truy xuất nguồn gốc</h1>
      </header>

      <main className="public-content">
        {!isOnBlockchain && (
          <div className="warning-banner">
            ⚠️ <strong>Thông tin từ cơ sở dữ liệu</strong> - Sản phẩm chưa được xác thực trên blockchain
          </div>
        )}

        <div className="company-info">
          <h2>Nguồn cung cấp HKD/DN: {product.supplier || product.farmerName || product.farm || 'Chưa cập nhật'}</h2>
        </div>

        <div className="info-section">
          <h3 className="section-title">Thông tin sản phẩm</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Tên sản phẩm:</span>
              <span className="value">{product.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Tên nhà cung cấp:</span>
              <span className="value">{product.supplier || product.farmerName || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Nơi trồng:</span>
              <span className="value">{product.location || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Nơi đóng gói:</span>
              <span className="value">{product.packingLocation || 'Chưa cập nhật'}</span>
            </div>
            <div className="info-item">
              <span className="label">Số thửa/lô sản phẩm:</span>
              <span className="value">{product.lotNumber || product.productId}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày thu hoạch:</span>
              <span className="value">{formatDate(product.harvestDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày đóng gói:</span>
              <span className="value">{formatDate(product.packingDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Ngày giao hàng:</span>
              <span className="value">{formatDate(product.deliveryDate)}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h3 className="section-title">Thông tin về chứng nhận sản phẩm</h3>
          {product.certifications && product.certifications.length > 0 ? (
            product.certifications.map((cert, index) => (
              <div key={index} className="cert-info">
                <div className="info-item">
                  <span className="label">Tiêu chuẩn sản phẩm:</span>
                  <span className="value cert-link">{cert.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Mã số Giấy chứng nhận:</span>
                  <span className="value">{cert.certificateNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Có hiệu lực đến:</span>
                  <span className="value">{formatDate(cert.validUntil)}</span>
                </div>
                {cert.standard && (
                  <div className="info-item">
                    <span className="label">Tiêu chuẩn nhà sơ chế:</span>
                    <span className="value cert-link">{cert.standard}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Tiêu chuẩn sản phẩm:</span>
                <span className="value">Chưa cập nhật</span>
              </div>
              <div className="info-item">
                <span className="label">Mã số Giấy chứng nhận:</span>
                <span className="value">Chưa cập nhật</span>
              </div>
            </div>
          )}
        </div>

        {isOnBlockchain && (
          <div className="blockchain-badge">
            🔐 <strong>Được xác thực trên Blockchain</strong> - Thông tin không thể bị thay đổi
          </div>
        )}

        {traces.length > 0 && (
          <div className="info-section">
            <h3 className="section-title">Lịch sử truy vết</h3>
            <div className="timeline-public">
              {traces.map((trace, index) => (
                <div key={index} className="timeline-item-public">
                  <div className="timeline-marker-public">
                    <div className="timeline-dot-public"></div>
                    {index < traces.length - 1 && <div className="timeline-line-public"></div>}
                  </div>
                  <div className="timeline-content-public">
                    <div className="trace-step">Bước {index + 1}</div>
                    <div className="trace-action">{trace.action}</div>
                    <div className="trace-details">
                      📍 {trace.location} | ⏰ {formatTimestamp(trace.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {updateHistory && updateHistory.length > 0 && (
          <div className="info-section">
            <h3 className="section-title">📋 Lịch Sử Cập Nhật Thông Tin</h3>
            <p className="history-note">
              ℹ️ Hệ thống áp dụng cơ chế append-only. Mỗi lần cập nhật tạo bản ghi mới thay vì ghi đè dữ liệu cũ.
            </p>
            <div className="update-history">
              {updateHistory.map((update, index) => (
                <div key={update._id || index} className="history-item">
                  <div className="history-header">
                    <span className="history-type">
                      {update.updateType === 'CREATE' ? '🆕 Tạo mới' :
                       update.updateType === 'UPDATE_CERTIFICATION' ? '🏆 Cập nhật chứng nhận' :
                       update.updateType === 'UPDATE_DATES' ? '📅 Cập nhật ngày tháng' :
                       '✏️ Cập nhật thông tin'}
                    </span>
                    <span className="history-time">
                      {new Date(update.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  {update.reason && (
                    <div className="history-reason">{update.reason}</div>
                  )}
                  {update.blockchainHash && (
                    <div className="history-hash">
                      🔐 Hash: <code>{update.blockchainHash.substring(0, 16)}...</code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="public-footer">
        <p>Hệ thống truy xuất nguồn gốc GreenOrigin</p>
      </footer>
    </div>
  );
}

export default PublicTrace;
