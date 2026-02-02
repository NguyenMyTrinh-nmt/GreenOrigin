import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import TraceForm from './TraceForm';
import QRCodeModal from './QRCodeModal';
import ProductUpdateForm from './ProductUpdateForm';
import ProductDetail from './ProductDetail';
import './TraceList.css';

function TraceList() {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [traces, setTraces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTraceForm, setShowTraceForm] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProductForQR, setSelectedProductForQR] = useState(null);
  const [selectedProductForUpdate, setSelectedProductForUpdate] = useState(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);
  const [error, setError] = useState('');

  // Tải danh sách batches
  const loadBatches = async () => {
    try {
      setLoading(true);
      const response = await api.get('/batches');
      if (response.data.success) {
        setBatches(response.data.data);
      }
    } catch (err) {
      console.error('Error loading batches:', err);
      setError('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Tải lịch sử truy vết của một sản phẩm
  const loadTraces = async (productId) => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/batches/${productId}/traces`);
      if (response.data.success) {
        setTraces(response.data.data);
        setSelectedProduct(productId);
      }
    } catch (err) {
      console.error('Error loading traces:', err);
      if (err.response?.status === 500 && err.response?.data?.message?.includes('Product not found')) {
        setError('Sản phẩm này chưa được thêm vào blockchain. Vui lòng thêm sản phẩm trước.');
        setTraces([]);
      } else {
        setError('Không thể tải lịch sử truy vết');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleTraceAdded = () => {
    if (selectedProduct) {
      loadTraces(selectedProduct);
    }
  };

  const handleShowQR = (batch) => {
    setSelectedProductForQR(batch);
    setShowQRModal(true);
  };

  const handleAddToBlockchain = async (batch) => {
    if (!window.confirm(`Bạn có chắc muốn thêm sản phẩm "${batch.product_name}" vào blockchain?`)) {
      return;
    }

    try {
      setLoading(true);
      
      // Lấy thông tin đầy đủ của sản phẩm từ database
      const productResponse = await api.get(`/batches/${batch.batch_id}`);
      const productData = productResponse.data.data;
      
      const response = await api.post('/batches/products', {
        productId: batch.batch_id,
        name: batch.product_name,
        farm: productData.location || productData.farm || 'Chưa cập nhật'
      });

      if (response.data.success) {
        alert(`✅ Đã thêm sản phẩm vào blockchain!\n\nTransaction: ${response.data.data.transactionHash}`);
        loadBatches();
      }
    } catch (error) {
      console.error('Error adding to blockchain:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message;
      alert(`❌ Lỗi: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trace-list-container">
      <div className="trace-header">
        <h2>📝 Truy Vết Nguồn Gốc</h2>
        <div className="header-actions">
          <button 
            className="btn-add-trace"
            onClick={() => setShowTraceForm(true)}
          >
            ➕ Thêm Bước Truy Vết
          </button>
        </div>
      </div>

      <div className="trace-content">
        <div className="batches-panel">
          <h3>Danh Sách Sản Phẩm</h3>
          {loading && batches.length === 0 && <p>Đang tải...</p>}
          {batches.length === 0 && !loading && (
            <p className="empty-message">Chưa có sản phẩm nào</p>
          )}
          <div className="batch-list">
            {batches.map((batch) => (
              <div
                key={batch._id}
                className={`batch-item ${selectedProduct === batch.batch_id ? 'active' : ''}`}
              >
                <div 
                  className="batch-item-content"
                  onClick={() => {
                    if (user?.role === 'CONSUMER') {
                      setSelectedProductForDetail(batch.batch_id);
                      setShowProductDetail(true);
                    } else {
                      loadTraces(batch.batch_id);
                    }
                  }}
                >
                  <div className="batch-icon">📦</div>
                  <div className="batch-info">
                    <div className="batch-id">{batch.batch_id}</div>
                    <div className="batch-name">{batch.product_name}</div>
                  </div>
                </div>
                {user?.role !== 'CONSUMER' && (
                <div className="batch-actions">
                  <button 
                    className="btn-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductForUpdate(batch.batch_id);
                      setShowUpdateForm(true);
                    }}
                    title="Cập nhật thông tin"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-qr"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowQR(batch);
                    }}
                    title="Xem mã QR"
                  >
                    📱
                  </button>
                  <button 
                    className="btn-blockchain"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToBlockchain(batch);
                    }}
                    title="Thêm vào blockchain"
                  >
                    🔗
                  </button>
                </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {user?.role !== 'CONSUMER' && (
        <div className="traces-panel">
          {!selectedProduct ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>Chọn một sản phẩm để xem lịch sử truy vết</p>
            </div>
          ) : (
            <>
              <div className="traces-header">
                <h3>Lịch Sử Truy Vết: {selectedProduct}</h3>
                <button 
                  className="btn-refresh"
                  onClick={() => loadTraces(selectedProduct)}
                >
                  🔄 Làm mới
                </button>
              </div>

              {error && <div className="error-banner">{error}</div>}

              {loading ? (
                <p>Đang tải...</p>
              ) : traces.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p>Chưa có bước truy vết nào</p>
                  <button 
                    className="btn-add-first"
                    onClick={() => setShowTraceForm(true)}
                  >
                    Thêm bước đầu tiên
                  </button>
                </div>
              ) : (
                <div className="timeline">
                  {traces.map((trace, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker">
                        <div className="timeline-dot"></div>
                        {index < traces.length - 1 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <div className="trace-card">
                          <div className="trace-header-info">
                            <span className="trace-action">{trace.action}</span>
                            <span className="trace-index">Bước {index + 1}</span>
                          </div>
                          {traces.findIndex(t => t.action === trace.action) !== index && (
                            <div className="trace-update-note">
                              Đây là lần cập nhật thông tin cho bước "{trace.action}" để đảm bảo minh bạch.
                            </div>
                          )}
                          <div className="trace-details">
                            <div className="trace-detail">
                              <span className="label">📍 Địa điểm:</span>
                              <span className="value">{trace.location}</span>
                            </div>
                            <div className="trace-detail">
                              <span className="label">⏰ Thời gian:</span>
                              <span className="value">{formatTimestamp(trace.timestamp)}</span>
                            </div>
                            <div className="trace-detail">
                              <span className="label">👤 Người thực hiện:</span>
                              <span className="value monospace">{formatAddress(trace.actor)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        )}
      </div>

      {showTraceForm && (
        <TraceForm
          onClose={() => setShowTraceForm(false)}
          onSuccess={handleTraceAdded}
          productId={selectedProduct}
        />
      )}

      {showQRModal && selectedProductForQR && (
        <QRCodeModal
          productId={selectedProductForQR.batch_id}
          productName={selectedProductForQR.product_name}
          onClose={() => {
            setShowQRModal(false);
            setSelectedProductForQR(null);
          }}
        />
      )}

      {showUpdateForm && selectedProductForUpdate && (
        <ProductUpdateForm
          productId={selectedProductForUpdate}
          onClose={() => {
            setShowUpdateForm(false);
            setSelectedProductForUpdate(null);
          }}
          onSuccess={() => {
            loadBatches();
            if (selectedProduct === selectedProductForUpdate) {
              loadTraces(selectedProductForUpdate);
            }
          }}
        />
      )}

      {showProductDetail && selectedProductForDetail && (
        <ProductDetail
          productId={selectedProductForDetail}
          onClose={() => {
            setShowProductDetail(false);
            setSelectedProductForDetail(null);
          }}
        />
      )}
    </div>
  );
}

export default TraceList;
