# 📱 Hướng Dẫn Sử Dụng Mã QR Truy Vết

## 🎯 Tổng Quan
Chức năng mã QR cho phép người tiêu dùng dễ dàng quét và xem thông tin truy vết sản phẩm bằng điện thoại mà không cần đăng nhập.

## 🚀 Cách Sử Dụng

### 1️⃣ Tạo Mã QR Cho Sản Phẩm
1. Vào tab **"Truy vết"** trên Dashboard
2. Trong danh sách sản phẩm bên trái, click vào icon **📱** trên sản phẩm bạn muốn tạo QR
3. Modal hiển thị mã QR sẽ xuất hiện với:
   - Mã QR code lớn và rõ nét
   - Thông tin sản phẩm
   - URL để quét
   - Nút tải xuống QR

### 2️⃣ Tải Xuống Mã QR
1. Trong modal mã QR, click nút **"📥 Tải xuống QR"**
2. File PNG sẽ được tải về với tên: `QR_[MãSảnPhẩm].png`
3. In mã QR này dán lên bao bì sản phẩm

### 3️⃣ Quét Mã QR Bằng Điện Thoại
1. Người tiêu dùng mở camera hoặc app quét QR trên điện thoại
2. Quét mã QR trên bao bì sản phẩm
3. Tự động mở trang web hiển thị:
   - ✅ Thông tin sản phẩm đã xác thực
   - 🏭 Nông trại / nơi sản xuất
   - 📅 Ngày tạo sản phẩm
   - 📜 Lịch sử truy vết đầy đủ (timeline)
   - 🔐 Badge bảo mật blockchain

### 4️⃣ Thông Tin Hiển Thị Trên Trang Public
Khi quét QR, người dùng sẽ thấy:
- **Header**: Logo GreenOrigin
- **Thông tin sản phẩm**:
  - Badge "Đã xác thực"
  - Tên sản phẩm
  - Mã sản phẩm
  - Nông trại
  - Ngày tạo
  - Số bước truy vết
- **Lịch sử truy vết** dạng timeline:
  - Mỗi bước với số thứ tự
  - Hành động đã thực hiện
  - Địa điểm
  - Thời gian
  - Địa chỉ blockchain người thực hiện
- **Badge blockchain**: Đảm bảo tính minh bạch

## 💡 Ưu Điểm

### ✅ Cho Người Sản Xuất
- Dễ dàng tạo và tải mã QR
- Tăng độ tin cậy cho sản phẩm
- Marketing hiệu quả
- Không cần training người dùng cuối

### ✅ Cho Người Tiêu Dùng
- Không cần cài app
- Không cần đăng nhập
- Chỉ cần quét QR là xem được thông tin
- Giao diện đẹp, dễ đọc trên mobile
- Thông tin minh bạch, không thể giả mạo

## 📋 Quy Trình Hoàn Chỉnh

```
1. Thêm sản phẩm vào blockchain
   ↓
2. Thêm các bước truy vết
   ↓
3. Tạo mã QR cho sản phẩm
   ↓
4. Tải xuống và in mã QR
   ↓
5. Dán QR lên bao bì sản phẩm
   ↓
6. Người tiêu dùng quét QR
   ↓
7. Xem thông tin truy vết đầy đủ
```

## 🎨 Tính Năng Nổi Bật

### 📱 Responsive Design
- Tự động tối ưu cho mọi màn hình
- Đẹp trên cả mobile và desktop

### 🎯 User-Friendly
- Không cần đăng nhập
- Truy cập công khai
- Giao diện trực quan

### 🔐 Bảo Mật
- Dữ liệu từ blockchain không thể sửa đổi
- Mỗi bước ghi lại địa chỉ người thực hiện
- Timestamp từ blockchain

### ⚡ Nhanh Chóng
- Load nhanh
- Hiển thị thông tin ngay lập tức
- Không cần cài đặt

## 🔧 Khắc Phục Sự Cố

### Không quét được QR?
- ✅ Đảm bảo mã QR rõ nét khi in
- ✅ Đủ ánh sáng để quét
- ✅ Camera điện thoại lấy nét tốt

### Trang không load?
- ✅ Kiểm tra kết nối internet
- ✅ Đảm bảo backend đang chạy
- ✅ Kiểm tra blockchain node hoạt động

### Không hiển thị thông tin?
- ✅ Đảm bảo sản phẩm đã được thêm vào blockchain
- ✅ Kiểm tra mã sản phẩm đúng
- ✅ Refresh lại trang

## 📊 URL Structure

Format URL cho trang public:
```
http://localhost:3000/trace/[productId]

Ví dụ:
http://localhost:3000/trace/SP001
http://localhost:3000/trace/GAO-ST25
```

## 🎯 Best Practices

1. **Tạo mã sản phẩm dễ nhớ**: SP001, GAO-ST25, v.v.
2. **In QR với độ phân giải cao**: Tối thiểu 280x280px
3. **Để QR ở vị trí dễ thấy** trên bao bì
4. **Test QR trước khi in hàng loạt**
5. **Thêm đầy đủ thông tin truy vết** trước khi phát hành

## 🌟 Ứng Dụng Thực Tế

### 🌾 Nông sản
- Gạo, rau, củ, quả
- Coffee, tea
- Sản phẩm hữu cơ

### 🥩 Thực phẩm
- Thịt, cá, hải sản
- Sản phẩm chế biến
- Đồ uống

### 🎁 Thương hiệu cao cấp
- Sản phẩm premium cần xác thực
- Gift sets
- Limited editions

## 📞 Hỗ Trợ

Nếu có vấn đề:
1. Kiểm tra console log (F12)
2. Xem TECHNICAL_DOC.md
3. Đảm bảo tất cả services đang chạy
