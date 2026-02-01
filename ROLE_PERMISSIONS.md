# 🔐 Hệ thống phân quyền GreenOrigin

## 📋 Danh sách vai trò

### 1️⃣ ADMIN (Quản trị viên) 🔴
**Toàn quyền quản lý hệ thống**

✅ **Quyền:**
- ✅ Quản lý người dùng (thêm/sửa/xóa/phân quyền)
- ✅ Quản lý sản phẩm (thêm/sửa/xóa)
- ✅ Quản lý quy trình truy xuất
- ✅ Xem & chỉnh sửa toàn bộ lịch sử truy vết
- ✅ Thống kê, báo cáo
- ✅ Cấu hình hệ thống

📱 **Menu hiển thị:**
- Tổng quan
- Sản phẩm
- Truy vết
- Người dùng

---

### 2️⃣ GROWER (Nông hộ) 🟢
**Người tạo ra nông sản ban đầu**

✅ **Quyền:**
- ✅ Thêm/cập nhật thông tin nông sản của mình
- ✅ Ghi nhận: ngày gieo trồng, phân bón, thuốc BVTV, thu hoạch
- ✅ Xem truy vết sản phẩm của chính mình
- ✅ Xem thông tin cá nhân

❌ **Không được:**
- ❌ Quản lý người dùng
- ❌ Xóa sản phẩm
- ❌ Sửa dữ liệu của người khác

📱 **Menu hiển thị:**
- Tổng quan
- Sản phẩm
- Truy vết

---

### 3️⃣ TRANSPORTER (Vận chuyển) 🚚
**Chỉ tham gia giai đoạn vận chuyển**

✅ **Quyền:**
- ✅ Cập nhật thông tin vận chuyển:
  - Thời gian nhận hàng
  - Điều kiện vận chuyển (nhiệt độ, độ ẩm)
  - Thời gian giao hàng
- ✅ Xem thông tin sản phẩm được giao
- ✅ Xem truy vết liên quan

❌ **Không được:**
- ❌ Tạo sản phẩm
- ❌ Sửa dữ liệu nông hộ
- ❌ Quản lý người dùng
- ❌ Xóa dữ liệu

📱 **Menu hiển thị:**
- Tổng quan
- Truy vết

---

### 4️⃣ VERIFIER (Kiểm định) 🧪
**Đảm bảo tính minh bạch & chất lượng**

✅ **Quyền:**
- ✅ Xem toàn bộ thông tin truy xuất
- ✅ Thêm kết quả kiểm định
- ✅ Xác nhận/từ chối chất lượng sản phẩm

❌ **Không được:**
- ❌ Sửa dữ liệu gốc
- ❌ Tạo/xóa sản phẩm
- ❌ Quản lý người dùng

📱 **Menu hiển thị:**
- Tổng quan
- Truy vết

---

### 5️⃣ CONSUMER (Người tiêu dùng) 👤
**Chỉ xem - không chỉnh sửa**

✅ **Quyền:**
- ✅ Quét QR code
- ✅ Xem toàn bộ lịch sử truy xuất
- ✅ Xem thông tin sản phẩm
- ✅ Xem thống kê

❌ **Không được:**
- ❌ Đăng dữ liệu
- ❌ Thay đổi thông tin
- ❌ Thấy menu quản trị

📱 **Menu hiển thị:**
- Tổng quan (chỉ xem)

---

## 🔒 Ma trận phân quyền

| Chức năng | ADMIN | GROWER | TRANSPORTER | VERIFIER | CONSUMER |
|-----------|-------|--------|-------------|----------|----------|
| **Xem sản phẩm** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Thêm sản phẩm** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Sửa sản phẩm** | ✅ | ✅* | ❌ | ❌ | ❌ |
| **Xóa sản phẩm** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Thêm truy vết** | ✅ | ✅** | ✅*** | ✅**** | ❌ |
| **Xem truy vết** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Quản lý user** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Xem thống kê** | ✅ | ✅ | ✅ | ✅ | ✅ |

*Chỉ sửa sản phẩm của chính mình  
**Thêm thông tin gieo trồng, thu hoạch  
***Thêm thông tin vận chuyển  
****Thêm kết quả kiểm định

---

## 🛠️ Technical Implementation

### Backend Routes

#### Product Routes (`/api/products`)
```javascript
GET    /              -> Tất cả roles
GET    /:id           -> Tất cả roles
GET    /history/:id   -> Tất cả roles
POST   /              -> ADMIN, GROWER
PUT    /:id           -> ADMIN, GROWER
DELETE /:id           -> ADMIN only
```

#### Batch/Trace Routes (`/api/batches`)
```javascript
GET    /              -> Tất cả (public)
GET    /:productId    -> Tất cả (public)
GET    /:productId/traces -> Tất cả (public)
POST   /products      -> ADMIN, GROWER
POST   /:productId/traces -> ADMIN, GROWER, TRANSPORTER, VERIFIER
```

#### User Routes (`/api/users`)
```javascript
GET    /     -> ADMIN only
POST   /     -> ADMIN only
PUT    /:id  -> ADMIN only
DELETE /:id  -> ADMIN only
```

### Frontend Components

#### Dashboard Menu
```javascript
- Tổng quan: Tất cả roles
- Sản phẩm: ADMIN, GROWER
- Truy vết: ADMIN, GROWER, TRANSPORTER, VERIFIER
- Người dùng: ADMIN
```

#### Action Buttons
```javascript
- Thêm sản phẩm: ADMIN, GROWER
- Tạo truy vết: ADMIN, GROWER, TRANSPORTER, VERIFIER
- Xem báo cáo: Tất cả roles
- Xóa sản phẩm: ADMIN only
```

---

## 🚀 Hướng dẫn sử dụng

### Đăng nhập lần đầu
1. User đầu tiên đăng nhập → tự động là **ADMIN**
2. Các user sau → mặc định là **CONSUMER**
3. ADMIN có thể thay đổi role cho users khác

### Thay đổi role
```bash
# Sử dụng script có sẵn
cd backend
node updateAdminRole.js <wallet_address>
```

Hoặc thông qua giao diện **Người dùng** (chỉ ADMIN):
1. Đăng nhập với tài khoản ADMIN
2. Vào menu **Người dùng**
3. Chọn user cần thay đổi
4. Cập nhật role

---

## 📝 Lưu ý quan trọng

1. **CONSUMER không đăng nhập được Dashboard** - họ chỉ xem qua QR code
2. **GROWER chỉ sửa được sản phẩm của mình** - cần kiểm tra ownership
3. **ADMIN là vai trò duy nhất có thể xóa dữ liệu**
4. **Role được lưu trong JWT token** - cần đăng xuất/nhập lại sau khi đổi role
5. **Blockchain transactions** - tất cả thay đổi quan trọng đều ghi lên blockchain

---

## 🔄 Workflow chuẩn

### 1. Nông hộ (GROWER)
```
1. Đăng nhập
2. Thêm sản phẩm mới
3. Cập nhật thông tin trồng trọt
4. Ghi nhận thu hoạch
```

### 2. Vận chuyển (TRANSPORTER)
```
1. Đăng nhập
2. Quét QR/tìm sản phẩm
3. Thêm thông tin vận chuyển
4. Cập nhật trạng thái giao hàng
```

### 3. Kiểm định (VERIFIER)
```
1. Đăng nhập
2. Xem thông tin sản phẩm
3. Kiểm tra chất lượng
4. Thêm kết quả kiểm định
```

### 4. Người tiêu dùng (CONSUMER)
```
1. Quét QR code
2. Xem lịch sử truy xuất
3. Xem chứng nhận
4. Tin tưởng nguồn gốc
```

---

## 🐛 Troubleshooting

### Lỗi 403 Forbidden
- Kiểm tra role của user
- Đảm bảo token JWT còn hạn
- Đăng xuất và đăng nhập lại

### Không thấy menu
- Kiểm tra role trong localStorage
- Clear cache trình duyệt
- Kiểm tra console logs

### Không thêm được dữ liệu
- Kiểm tra quyền của role hiện tại
- Xem error message từ backend
- Kiểm tra network tab

---

Cập nhật: 01/02/2026
Phiên bản: 2.0
