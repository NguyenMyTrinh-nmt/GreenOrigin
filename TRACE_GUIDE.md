# 📝 Hướng Dẫn Sử Dụng Chức Năng Truy Vết

## 🎯 Tổng Quan
Chức năng truy vết cho phép bạn ghi lại và theo dõi toàn bộ hành trình của sản phẩm nông sản từ nông trại đến người tiêu dùng, được lưu trữ an toàn trên blockchain.

## 🚀 Các Bước Sử Dụng

### Bước 1: Thêm Sản Phẩm vào Blockchain
1. Vào tab **"Truy vết"** trên Dashboard
2. Click nút **"🌾 Thêm Sản Phẩm"**
3. Điền thông tin:
   - **Mã Sản Phẩm**: Mã định danh duy nhất (VD: SP001)
   - **Tên Sản Phẩm**: Tên nông sản (VD: Gạo ST25)
   - **Nông Trại**: Nơi sản xuất (VD: Nông trại Xanh, Đồng Nai)
4. Click **"Thêm vào Blockchain"**
5. ✅ Sản phẩm sẽ được ghi vào blockchain và transaction hash sẽ hiển thị

### Bước 2: Thêm Bước Truy Vết
1. Chọn sản phẩm từ danh sách bên trái
2. Click nút **"➕ Thêm Bước Truy Vết"**
3. Điền thông tin:
   - **Mã Sản Phẩm**: Tự động điền nếu đã chọn sản phẩm
   - **Hành Động**: Chọn từ danh sách (Thu hoạch, Đóng gói, Vận chuyển, v.v.)
   - **Địa Điểm**: Nơi thực hiện hành động
4. Click **"Thêm Bước Truy Vết"**
5. ✅ Bước truy vết sẽ được ghi vào blockchain

### Bước 3: Xem Lịch Sử Truy Vết
1. Chọn sản phẩm từ danh sách bên trái
2. Xem timeline hiển thị tất cả các bước theo thứ tự thời gian
3. Mỗi bước hiển thị:
   - ✏️ Hành động thực hiện
   - 📍 Địa điểm
   - ⏰ Thời gian (từ blockchain)
   - 👤 Địa chỉ ví người thực hiện

## 📊 Thống Kê
Dashboard hiển thị:
- **Tổng sản phẩm**: Số lượng sản phẩm đã đăng ký
- **Bản ghi truy vết**: Tổng số bước truy vết
- **Đã xác thực**: Số sản phẩm đã được xác thực
- **Blockchain Tx**: Tổng số giao dịch trên blockchain

## 🔐 Bảo Mật
- Tất cả dữ liệu được lưu trữ trên blockchain, không thể chỉnh sửa hay xóa
- Mỗi bước truy vết ghi lại địa chỉ ví của người thực hiện
- Transaction hash có thể kiểm tra trên blockchain explorer

## 💡 Lưu Ý
- ⚠️ Phải thêm sản phẩm vào blockchain trước khi thêm bước truy vết
- ⚠️ Mã sản phẩm phải duy nhất, không trùng lặp
- ⚠️ Mỗi giao dịch cần gas fee (trên mainnet)
- ⚠️ Dữ liệu một khi đã ghi vào blockchain không thể sửa đổi

## 🛠️ Các Hành Động Có Sẵn
1. **Thu hoạch**: Ghi lại thời điểm thu hoạch từ nông trại
2. **Đóng gói**: Đóng gói sản phẩm
3. **Vận chuyển**: Di chuyển sản phẩm
4. **Kiểm tra chất lượng**: Kiểm định chất lượng
5. **Nhập kho**: Nhập vào kho
6. **Xuất kho**: Xuất ra khỏi kho
7. **Phân phối**: Phân phối đến điểm bán
8. **Bán lẻ**: Bán cho người tiêu dùng

## 🔧 Khắc Phục Sự Cố

### Lỗi "Product not found"
- ✅ Giải pháp: Đảm bảo đã thêm sản phẩm vào blockchain trước

### Lỗi "Transaction failed"
- ✅ Giải pháp: Kiểm tra kết nối blockchain và số dư ví

### Không tải được danh sách
- ✅ Giải pháp: Kiểm tra kết nối backend API và database

## 📞 Hỗ Trợ
Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log của browser (F12)
2. Kiểm tra backend server đang chạy
3. Kiểm tra blockchain node đang hoạt động
4. Kiểm tra kết nối database MongoDB
