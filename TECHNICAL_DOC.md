# 🔧 Tài Liệu Kỹ Thuật - Chức Năng Truy Vết

## 📋 Tổng Quan Kiến Trúc

### Backend API Endpoints

#### 1. Thêm Sản Phẩm vào Blockchain
```
POST /api/batches/products
```
**Request Body:**
```json
{
  "productId": "SP001",
  "name": "Gạo ST25",
  "farm": "Nông trại Xanh, Đồng Nai"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Product added to blockchain successfully",
  "data": {
    "productId": "SP001",
    "name": "Gạo ST25",
    "farm": "Nông trại Xanh, Đồng Nai",
    "transactionHash": "0x...",
    "blockNumber": 12345
  }
}
```

#### 2. Thêm Bước Truy Vết
```
POST /api/batches/:productId/traces
```
**Request Body:**
```json
{
  "action": "Thu hoạch",
  "location": "Nông trại ABC"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Trace added to blockchain successfully",
  "data": {
    "productId": "SP001",
    "action": "Thu hoạch",
    "location": "Nông trại ABC",
    "transactionHash": "0x...",
    "blockNumber": 12346
  }
}
```

#### 3. Lấy Thông Tin Sản Phẩm
```
GET /api/batches/:productId
```
**Response:**
```json
{
  "success": true,
  "data": {
    "productId": "SP001",
    "name": "Gạo ST25",
    "farm": "Nông trại Xanh",
    "createdAt": 1234567890,
    "traceCount": 5
  }
}
```

#### 4. Lấy Lịch Sử Truy Vết
```
GET /api/batches/:productId/traces
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "action": "Thu hoạch",
      "location": "Nông trại ABC",
      "timestamp": 1234567890,
      "actor": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "index": 0
    }
  ],
  "total": 1
}
```

#### 5. Lấy Danh Sách Tất Cả Batches
```
GET /api/batches
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "batch_id": "SP001",
      "product_name": "Gạo ST25",
      "latest_transaction_hash": "0x...",
      "createdAt": "2026-01-29T..."
    }
  ],
  "total": 1
}
```

#### 6. Lấy Thống Kê
```
GET /api/batches/stats
```
**Response:**
```json
{
  "success": true,
  "data": {
    "totalBatches": 10,
    "totalTraces": 45,
    "verified": 10,
    "transactions": 55
  }
}
```

## 🔗 Smart Contract Interface

### Contract: AgroTraceability.sol

#### Functions:

1. **addProduct**
```solidity
function addProduct(
    string memory _productId,
    string memory _name,
    string memory _farm
) public
```

2. **addTrace**
```solidity
function addTrace(
    string memory _productId,
    string memory _action,
    string memory _location
) public
```

3. **getProduct**
```solidity
function getProduct(string memory _productId)
    public view
    returns (
        string memory productId,
        string memory name,
        string memory farm,
        uint256 createdAt,
        uint256 traceCount
    )
```

4. **getTrace**
```solidity
function getTrace(
    string memory _productId,
    uint256 _index
) public view
    returns (
        string memory action,
        string memory location,
        uint256 timestamp,
        address actor
    )
```

## 📁 Cấu Trúc File

### Backend
```
backend/
├── services/
│   └── blockchainService.js      # Tương tác với smart contract
├── controllers/
│   └── batchController.js        # Xử lý business logic
├── routes/
│   └── batchRoutes.js            # Định nghĩa API endpoints
└── contracts/
    └── AgroTraceability.sol      # Smart contract
```

### Frontend
```
frontend/src/
├── components/
│   ├── TraceForm.js              # Form thêm bước truy vết
│   ├── TraceForm.css
│   ├── TraceList.js              # Hiển thị danh sách và lịch sử
│   ├── TraceList.css
│   ├── BatchProductForm.js       # Form thêm sản phẩm
│   └── BatchProductForm.css
└── pages/
    └── Dashboard.js              # Tích hợp các component
```

## 🔄 Luồng Dữ Liệu

### Thêm Sản Phẩm:
```
User Input → BatchProductForm → API POST /batches/products 
→ batchController.addProduct → blockchainService.addProductToChain 
→ Smart Contract.addProduct → Blockchain → Response
```

### Thêm Bước Truy Vết:
```
User Input → TraceForm → API POST /batches/:id/traces 
→ batchController.addTrace → blockchainService.addTraceToChain 
→ Smart Contract.addTrace → Blockchain → Response
```

### Xem Lịch Sử:
```
User Click → TraceList → API GET /batches/:id/traces 
→ batchController.getTraces → blockchainService.getAllTracesFromChain 
→ Smart Contract.getProduct + getTrace (loop) → Response
```

## 🛠️ Setup & Configuration

### Environment Variables (.env)
```env
# Blockchain Configuration
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_contract_address_here

# Database
MONGODB_URI=mongodb://localhost:27017/greenorigin

# Server
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

### Dependencies

**Backend:**
```json
{
  "ethers": "^6.x",
  "express": "^4.x",
  "mongoose": "^8.x"
}
```

**Frontend:**
```json
{
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "axios": "^1.x"
}
```

## 🧪 Testing

### Test Cases

1. **Test Thêm Sản Phẩm**
   - Input: Valid productId, name, farm
   - Expected: Success response with transaction hash

2. **Test Thêm Bước Truy Vết**
   - Input: Existing productId, action, location
   - Expected: Success response with transaction hash

3. **Test Lấy Lịch Sử**
   - Input: Existing productId
   - Expected: Array of traces

4. **Test Error Handling**
   - Input: Non-existing productId
   - Expected: Error response with appropriate message

## 🔐 Security Considerations

1. **Blockchain Private Key**: Không được commit vào git, lưu trong .env
2. **Input Validation**: Validate tất cả input trước khi gửi lên blockchain
3. **Gas Limit**: Cần set gas limit phù hợp cho mỗi transaction
4. **Error Handling**: Xử lý các lỗi từ blockchain một cách an toàn

## 📈 Performance

- **Batch Processing**: Có thể cải thiện bằng cách batch nhiều traces
- **Caching**: Cache kết quả từ blockchain để giảm số lần query
- **Pagination**: Implement pagination cho danh sách lớn

## 🚀 Future Enhancements

1. **QR Code Generation**: Tự động tạo QR code cho mỗi sản phẩm
2. **Image Upload**: Upload hình ảnh cho mỗi bước truy vết
3. **Real-time Updates**: WebSocket để cập nhật real-time
4. **Analytics Dashboard**: Biểu đồ và thống kê chi tiết
5. **Export Data**: Export lịch sử truy vết ra PDF/Excel
6. **Mobile App**: Phiên bản mobile app
