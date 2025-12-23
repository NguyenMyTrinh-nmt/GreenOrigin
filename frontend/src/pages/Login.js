import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet, loginWithMetaMask } from '../utils/web3Auth';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const handleMetaMaskLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Kết nối ví
      const { signer, address } = await connectWallet();
      setWalletAddress(address);

      // Đăng nhập
      const result = await loginWithMetaMask(signer, address);
      
      // Cập nhật auth context
      login(result.walletAddress, result.token);

      // Chuyển đến trang dashboard
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      if (err.message.includes('MetaMask')) {
        setError('Vui lòng cài đặt MetaMask extension!');
      } else if (err.code === 4001) {
        setError('Bạn đã từ chối kết nối ví.');
      } else {
        setError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="icon">🌱</div>
          <h1 className="title">TRUY XUẤT NGUỒN GỐC NÔNG SẢN</h1>
          <p className="subtitle">Đăng nhập vào hệ thống quản lý</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {walletAddress && (
          <div className="wallet-info">
            <small>Địa chỉ ví:</small>
            <div className="wallet-address">{walletAddress}</div>
          </div>
        )}

        <div className="login-form">
          <input
            type="email"
            placeholder="admin@gmail.com"
            className="input-field"
            disabled
          />
          
          <input
            type="password"
            placeholder="••••••"
            className="input-field"
            disabled
          />

          <button
            className="metamask-button"
            onClick={handleMetaMaskLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang kết nối...
              </>
            ) : (
              <>
                🦊 KẾT NỐI VỚI MetaMask
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          <p>Sử dụng ví MetaMask để đăng nhập an toàn</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
