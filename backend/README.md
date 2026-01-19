# GreenOrigin Backend API

Backend API cho hệ thống truy vết nguồn gốc nông sản GreenOrigin sử dụng Node.js, Express, MongoDB và tích hợp blockchain (MetaMask).

## Tính năng chính

- 🔐 Authentication & Authorization (JWT)
- 👤 Quản lý người dùng với nhiều vai trò (farmer, processor, distributor, retailer, admin)
- 🌾 Quản lý sản phẩm nông sản
- 📝 Hệ thống truy vết đầy đủ (traceability)
- 🔗 Tích hợp blockchain qua MetaMask
- 💼 Kết nối MongoDB

## Cấu trúc thư mục

```
backend/
├── config/          # Cấu hình database và blockchain
├── controllers/     # Business logic
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Custom middleware (auth, etc.)
├── utils/           # Utility functions
├── .env.example     # Biến môi trường mẫu
├── .gitignore
├── package.json
└── server.js        # Entry point
```

## Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình biến môi trường

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenorigin
JWT_SECRET=your_secret_key
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
CONTRACT_ADDRESS=0x...
```

### 3. Cài đặt MongoDB

**Windows:**
- Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
- Cài đặt và khởi động MongoDB service

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### 4. Chạy server

**Development mode (với nodemon):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server sẽ chạy tại: http://localhost:5000

## API Endpoints

### Authentication (api/auth)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | Private |
| PUT | `/api/auth/updateprofile` | Cập nhật profile | Private |
| POST | `/api/auth/verify-wallet` | Xác thực ví MetaMask | Private |

### Products (/api/products)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/products` | Lấy danh sách sản phẩm | Public |
| GET | `/api/products/:id` | Chi tiết sản phẩm theo ID | Public |
| GET | `/api/products/code/:productId` | Chi tiết sản phẩm theo mã | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Private (Farmer/Admin) |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | Private (Owner) |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Private (Owner) |
| PUT | `/api/products/:id/status` | Cập nhật trạng thái | Private |

### Traceability (/api/traceability)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | `/api/traceability/:productId` | Lấy các bản ghi truy vết | Public |
| GET | `/api/traceability/:productId/timeline` | Timeline đầy đủ của sản phẩm | Public |
| GET | `/api/traceability/record/:id` | Chi tiết bản ghi | Public |
| POST | `/api/traceability` | Thêm bản ghi truy vết | Private |
| PUT | `/api/traceability/record/:id` | Cập nhật bản ghi | Private (Owner) |
| DELETE | `/api/traceability/record/:id` | Xóa bản ghi | Private (Admin) |

## Models

### User
- name, email, password
- role: farmer, processor, distributor, retailer, admin
- walletAddress (MetaMask)
- phoneNumber, address

### Product
- productId (mã sản phẩm duy nhất)
- name, category, description
- origin (tỉnh, huyện, xã, tọa độ)
- farmer (người tạo)
- harvestDate, quantity
- certifications (chứng nhận)
- blockchainTxHash
- status: harvested, processing, in-transit, delivered, sold

### TraceabilityRecord
- product, productId
- stage: planting, growing, harvesting, processing, packaging, shipping, distribution, retail
- title, description
- location (địa chỉ, tọa độ)
- performer (người thực hiện)
- images, documents
- metadata (nhiệt độ, độ ẩm, trọng lượng, chất lượng)
- blockchainTxHash
- timestamp

### Transaction
- transactionHash
- type: product_creation, trace_record, ownership_transfer, quality_check
- productId
- from, to (wallet addresses)
- blockNumber, gasUsed
- status: pending, confirmed, failed

## Tích hợp Blockchain

### Smart Contract (Solidity) - Mẫu cơ bản

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GreenOriginTraceability {
    struct Product {
        string productId;
        string name;
        string origin;
        address creator;
        uint256 timestamp;
    }
    
    struct TraceRecord {
        string stage;
        string location;
        string description;
        address recorder;
        uint256 timestamp;
    }
    
    mapping(string => Product) public products;
    mapping(string => TraceRecord[]) public traceRecords;
    
    event ProductAdded(string productId, string name, address creator);
    event TraceRecordAdded(string productId, string stage, address recorder);
    
    function addProduct(string memory _productId, string memory _name, string memory _origin) public returns (bool) {
        products[_productId] = Product(_productId, _name, _origin, msg.sender, block.timestamp);
        emit ProductAdded(_productId, _name, msg.sender);
        return true;
    }
    
    function addTraceRecord(string memory _productId, string memory _stage, string memory _location, string memory _description) public returns (bool) {
        traceRecords[_productId].push(TraceRecord(_stage, _location, _description, msg.sender, block.timestamp));
        emit TraceRecordAdded(_productId, _stage, msg.sender);
        return true;
    }
    
    function getProduct(string memory _productId) public view returns (string memory, string memory, string memory, address, uint256) {
        Product memory p = products[_productId];
        return (p.productId, p.name, p.origin, p.creator, p.timestamp);
    }
    
    function getTraceRecords(string memory _productId) public view returns (TraceRecord[] memory) {
        return traceRecords[_productId];
    }
}
```

### Deploy Smart Contract

1. Cài đặt Hardhat:
```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
npx hardhat
```

2. Deploy lên testnet (Sepolia hoặc Mumbai):
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

3. Cập nhật CONTRACT_ADDRESS trong file `.env`

## MetaMask Integration

### Frontend (React) - Kết nối MetaMask

```javascript
import { ethers } from 'ethers';

// Kết nối MetaMask
async function connectWallet() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      return { address, signer, provider };
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  } else {
    alert('Vui lòng cài đặt MetaMask!');
  }
}

// Ký message để xác thực
async function signMessage(signer, message) {
  const signature = await signer.signMessage(message);
  return signature;
}
```

## Testing với Postman/Thunder Client

### 1. Đăng ký user
```json
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "farmer@example.com",
  "password": "123456",
  "role": "farmer",
  "phoneNumber": "0123456789",
  "address": "Đồng Tháp"
}
```

### 2. Đăng nhập
```json
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "farmer@example.com",
  "password": "123456"
}
```

### 3. Tạo sản phẩm (cần token)
```json
POST http://localhost:5000/api/products
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "productId": "OM001",
  "name": "Ớm Non Organic",
  "category": "vegetable",
  "description": "Ớm non trồng theo phương pháp hữu cơ",
  "origin": {
    "province": "Đồng Tháp",
    "district": "Thanh Bình",
    "ward": "Tân Quới",
    "address": "Ấp Bình Hòa"
  },
  "harvestDate": "2025-12-09",
  "quantity": {
    "value": 50,
    "unit": "kg"
  }
}
```

### 4. Thêm bản ghi truy vết
```json
POST http://localhost:5000/api/traceability
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "productId": "OM001",
  "stage": "harvesting",
  "title": "Thu hoạch ớm non",
  "description": "Thu hoạch 50kg ớm non vào sáng sớm",
  "location": {
    "province": "Đồng Tháp",
    "address": "Ấp Bình Hòa, Tân Quới, Thanh Bình"
  },
  "metadata": {
    "temperature": "28°C",
    "humidity": "75%",
    "quality": "A"
  }
}
```

## Các bước tiếp theo

1. ✅ Cài đặt dependencies: `cd backend && npm install`
2. ✅ Cấu hình file `.env`
3. ✅ Khởi động MongoDB
4. ✅ Chạy server: `npm run dev`
5. ⏳ Deploy Smart Contract lên testnet
6. ⏳ Tích hợp frontend với backend API
7. ⏳ Kết nối MetaMask từ frontend
8. ⏳ Test toàn bộ flow truy vết

## Lưu ý quan trọng

- Không commit file `.env` lên git
- Sử dụng testnet (Sepolia/Mumbai) cho development
- Private key chỉ dùng cho testnet, không dùng mainnet
- Backup MongoDB database định kỳ
- Implement rate limiting cho production
- Sử dụng HTTPS trong production

## Hỗ trợ

Nếu có câu hỏi hoặc vấn đề, vui lòng tạo issue hoặc liên hệ team.
