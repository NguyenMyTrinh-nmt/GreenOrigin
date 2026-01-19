import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import api from '../utils/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { walletAddress, logout } = useAuth();
  const [showProductForm, setShowProductForm] = useState(false);
  const [currentView, setCurrentView] = useState('overview'); // 'overview', 'products', 'trace', etc.
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRecords: 0,
    verified: 0,
    transactions: 0
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Load products
  const loadProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
        setStats(prev => ({
          ...prev,
          totalProducts: response.data.total || response.data.data.length
        }));
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleProductAdded = () => {
    loadProducts();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🌱 GreenOrigin</h1>
          <p className="tagline">Hệ thống truy xuất nguồn gốc nông sản</p>
        </div>
        <div className="header-right">
          <div className="wallet-info">
            <span className="wallet-label">Ví:</span>
            <span className="wallet-address">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'N/A'}
            </span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="sidebar">
          <nav className="nav-menu">
            <button 
              className={`nav-item ${currentView === 'overview' ? 'active' : ''}`}
              onClick={() => setCurrentView('overview')}
            >
              <span className="icon">📊</span>
              <span>Tổng quan</span>
            </button>
            <button 
              className={`nav-item ${currentView === 'products' ? 'active' : ''}`}
              onClick={() => setCurrentView('products')}
            >
              <span className="icon">🌾</span>
              <span>Sản phẩm</span>
            </button>
            <button 
              className={`nav-item ${currentView === 'trace' ? 'active' : ''}`}
              onClick={() => setCurrentView('trace')}
            >
              <span className="icon">📝</span>
              <span>Truy vết</span>
            </button>
            <button 
              className={`nav-item ${currentView === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentView('users')}
            >
              <span className="icon">👥</span>
              <span>Người dùng</span>
            </button>
            <button 
              className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
              onClick={() => setCurrentView('settings')}
            >
              <span className="icon">⚙️</span>
              <span>Cài đặt</span>
            </button>
          </nav>
        </aside>

        <main className="main-content">
          {currentView === 'overview' && (
            <>
              <div className="welcome-section">
                <h2>Chào mừng đến với GreenOrigin! 🎉</h2>
                <p>Bạn đã đăng nhập thành công bằng ví MetaMask</p>
              </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🌾</div>
              <div className="stat-info">
                <h3>Tổng sản phẩm</h3>
                <p className="stat-number">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <h3>Bản ghi truy vết</h3>
                <p className="stat-number">0</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>Đã xác thực</h3>
                <p className="stat-number">0</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔗</div>
              <div className="stat-info">
                <h3>Blockchain Tx</h3>
                <p className="stat-number">0</p>
              </div>
            </div>
          </div>

          <div className="action-section">
            <h3>Thao tác nhanh</h3>
            <div className="action-buttons">
              <button 
                className="action-button primary"
                onClick={() => setShowProductForm(true)}
              >
                ➕ Thêm sản phẩm mới
              </button>
              <button className="action-button secondary">
                📝 Tạo bản ghi truy vết
              </button>
              <button className="action-button secondary">
                📊 Xem báo cáo
              </button>
            </div>
          </div>

          <div className="info-section">
            <h3>Thông tin kết nối</h3>
            <div className="info-card">
              <div className="info-row">
                <span className="label">Địa chỉ ví:</span>
                <span className="value monospace">{walletAddress}</span>
              </div>
              <div className="info-row">
                <span className="label">Trạng thái:</span>
                <span className="value success">✅ Đã kết nối</span>
              </div>
              <div className="info-row">
                <span className="label">Backend API:</span>
                <span className="value success">✅ http://localhost:5000</span>
              </div>
            </div>
          </div>
            </>
          )}

          {currentView === 'products' && (
            <ProductList />
          )}

          {currentView === 'trace' && (
            <div className="coming-soon">
              <h2>📝 Truy vết</h2>
              <p>Chức năng đang phát triển...</p>
            </div>
          )}

          {currentView === 'users' && (
            <div className="coming-soon">
              <h2>👥 Quản lý người dùng</h2>
              <p>Chức năng đang phát triển...</p>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="coming-soon">
              <h2>⚙️ Cài đặt</h2>
              <p>Chức năng đang phát triển...</p>
            </div>
          )}
        </main>
      </div>

      {showProductForm && (
        <ProductForm
          onClose={() => setShowProductForm(false)}
          onSuccess={handleProductAdded}
        />
      )}
    </div>
  );
}

export default Dashboard;
