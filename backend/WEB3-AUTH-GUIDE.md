# Đăng nhập bằng MetaMask (Không cần MongoDB)

Hướng dẫn đăng nhập bằng Web3 Signature - không cần database.

## 🚀 Cách chạy nhanh

### 1. Cài đặt dependencies (nếu chưa)
```bash
cd backend
npm install
```

### 2. Tạo file .env (nếu chưa có)
```bash
# Tạo file .env với nội dung:
PORT=5000
JWT_SECRET=greenorigin_secret_key_2025
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 3. Chạy server Web3 Auth
```bash
node server-web3.js
```

Server sẽ chạy tại: **http://localhost:5000**

### 4. Test đăng nhập với demo page
Mở file: `demo-metamask-login.html` bằng Live Server hoặc trình duyệt

## 📋 Cách hoạt động

### Flow đăng nhập:

1. **User nhấn "Kết nối MetaMask"**
   - Frontend gọi `window.ethereum.request({ method: 'eth_requestAccounts' })`
   - MetaMask hiện popup để user chọn tài khoản

2. **User nhấn "Ký và Đăng nhập"**
   - Frontend gọi API: `POST /api/web3auth/request-nonce`
   - Server trả về message cần ký
   - Frontend gọi `signer.signMessage(message)`
   - MetaMask hiện popup để user ký

3. **Verify signature**
   - Frontend gửi signature lên server: `POST /api/web3auth/verify`
   - Server verify signature bằng `ethers.verifyMessage()`
   - Nếu hợp lệ, server trả về JWT token

4. **Sử dụng JWT token**
   - Frontend lưu token vào localStorage
   - Gửi token trong header: `Authorization: Bearer <token>`
   - Để truy cập các API protected

## 🔧 API Endpoints

### 1. Request Nonce
```http
POST http://localhost:5000/api/web3auth/request-nonce
Content-Type: application/json

{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Xác thực đăng nhập GreenOrigin\n\nĐịa chỉ ví: 0x742d35Cc...\nNonce: GreenOrigin-1234567890-abc123\nThời gian: 2025-12-09T...",
    "nonce": "GreenOrigin-1234567890-abc123",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }
}
```

### 2. Verify Signature
```http
POST http://localhost:5000/api/web3auth/verify
Content-Type: application/json

{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "signature": "0x123abc...",
  "message": "Xác thực đăng nhập GreenOrigin..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

### 3. Get User Info
```http
GET http://localhost:5000/api/web3auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "walletAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
    "type": "web3"
  }
}
```

## 💻 Tích hợp vào React Frontend

### 1. Cài đặt ethers.js
```bash
cd frontend
npm install ethers
```

### 2. Tạo file utils/web3Auth.js

```javascript
import { ethers } from 'ethers';

const API_URL = 'http://localhost:5000/api/web3auth';

export const connectWallet = async () => {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('Vui lòng cài đặt MetaMask!');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};

export const loginWithMetaMask = async (signer, walletAddress) => {
  // Bước 1: Lấy nonce
  const nonceResponse = await fetch(`${API_URL}/request-nonce`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress })
  });

  const nonceData = await nonceResponse.json();
  if (!nonceData.success) throw new Error(nonceData.message);

  const { message } = nonceData.data;

  // Bước 2: Ký message
  const signature = await signer.signMessage(message);

  // Bước 3: Verify và lấy token
  const verifyResponse = await fetch(`${API_URL}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, signature, message })
  });

  const verifyData = await verifyResponse.json();
  if (!verifyData.success) throw new Error(verifyData.message);

  // Lưu token
  localStorage.setItem('jwtToken', verifyData.data.token);
  localStorage.setItem('walletAddress', verifyData.data.walletAddress);

  return verifyData.data;
};

export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('walletAddress');
};
```

### 3. Tạo component Login.jsx

```javascript
import React, { useState } from 'react';
import { connectWallet, loginWithMetaMask } from '../utils/web3Auth';

function Login() {
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      // Kết nối ví
      const { signer, address } = await connectWallet();
      setWalletAddress(address);

      // Đăng nhập
      const result = await loginWithMetaMask(signer, address);
      
      console.log('Đăng nhập thành công:', result);
      alert('Đăng nhập thành công!');
      
      // Redirect hoặc reload
      window.location.href = '/dashboard';

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Đăng nhập bằng MetaMask</h1>
      
      {error && <div className="error">{error}</div>}
      
      {walletAddress && (
        <div className="wallet-info">
          Địa chỉ ví: {walletAddress}
        </div>
      )}

      <button 
        onClick={handleLogin} 
        disabled={loading}
        className="btn-metamask"
      >
        {loading ? 'Đang xử lý...' : '🦊 Kết nối MetaMask'}
      </button>
    </div>
  );
}

export default Login;
```

### 4. Sử dụng token trong API calls

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Thêm token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ví dụ: Gọi API protected
export const getMyProfile = async () => {
  const response = await api.get('/web3auth/me');
  return response.data;
};
```

## ✅ Ưu điểm của phương pháp này

1. **Không cần database**: Không phụ thuộc MongoDB
2. **Bảo mật cao**: Chỉ người có private key mới ký được
3. **UX tốt**: Không cần nhớ password
4. **Decentralized**: Phù hợp với Web3

## 🔒 Bảo mật

- Message chứa nonce ngẫu nhiên để tránh replay attack
- JWT token có thời gian hết hạn (7 ngày)
- Signature được verify bằng ethers.verifyMessage()
- Token chỉ hợp lệ cho 1 địa chỉ ví cụ thể

## 📝 Lưu ý

1. **JWT_SECRET**: Đổi thành chuỗi bí mật của bạn trong production
2. **CORS**: Cấu hình đúng origin trong production
3. **HTTPS**: Bắt buộc dùng HTTPS trong production
4. **Rate limiting**: Thêm rate limiting để tránh spam

## 🧪 Test với Postman

### Test Request Nonce:
```
POST http://localhost:5000/api/web3auth/request-nonce
Body (JSON):
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

### Test Verify (cần signature thật từ MetaMask):
```
POST http://localhost:5000/api/web3auth/verify
Body (JSON):
{
  "walletAddress": "0x...",
  "signature": "0x...",
  "message": "Xác thực đăng nhập GreenOrigin..."
}
```

---

**Bắt đầu ngay:**
```bash
cd backend
npm install
node server-web3.js
```

Sau đó mở file `demo-metamask-login.html` để test! 🎉
