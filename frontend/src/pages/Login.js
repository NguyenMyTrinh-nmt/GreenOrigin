import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet, loginWithMetaMask } from '../utils/web3Auth';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleMetaMaskLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Kết nối ví
      const { signer, address } = await connectWallet();
      setWalletAddress(address);

      // Đăng nhập
      const result = await loginWithMetaMask(signer, address);

      // Cập nhật auth context với thông tin user (nếu có)
      if (result?.user) {
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      login(result.walletAddress, result.token, result.user || null);

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

  const handleAccountLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/web3auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, user } = response.data.data;
        // Lưu token giống như MetaMask login
        localStorage.setItem('jwtToken', token);
        if (user.walletAddress) {
          localStorage.setItem('walletAddress', user.walletAddress);
        } else {
          localStorage.removeItem('walletAddress');
        }
        localStorage.setItem('user', JSON.stringify(user));

        // Cập nhật auth context (địa chỉ ví có thể null)
        login(user.walletAddress || null, token, user);
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Đăng nhập thất bại');
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <input
            type="password"
            placeholder="••••••"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="metamask-button"
            onClick={handleAccountLogin}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : '🔐 Đăng nhập bằng tài khoản'}
          </button>

          <div className="divider">Hoặc</div>

          <button
            className="metamask-button secondary"
            onClick={handleMetaMaskLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang kết nối MetaMask...
              </>
            ) : (
              <>
                🦊 KẾT NỐI VỚI MetaMask
              </>
            )}
          </button>
        </div>

        <div className="login-footer">
          <p>Có thể đăng nhập bằng tài khoản quản trị hoặc ví MetaMask</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
