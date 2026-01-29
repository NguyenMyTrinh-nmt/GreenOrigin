# 🚀 Hướng Dẫn Test QR Code Truy Xuất Nguồn Gốc

## 📱 Cách 2: QR Dẫn Tới Trang Web (Chuẩn chuyên nghiệp)

### ✅ Hệ thống đã làm đúng cách này!

**QR Code chứa:** URL trang web
```
http://10.10.10.47:3000/trace/SP032
```

**Khi quét QR, hiển thị:**
- ✅ Ảnh sản phẩm (nếu có)
- ✅ Tên sản phẩm
- ✅ Mã sản phẩm
- ✅ Mô tả sản phẩm
- ✅ Nông trại/nơi sản xuất
- ✅ Ngày đăng ký
- ✅ Trạng thái blockchain
- ✅ Lịch sử truy vết (timeline)
- ✅ Badges chứng nhận
- ✅ Thông tin không thể giả mạo

---

## 🎯 HƯỚNG DẪN TEST (Quan trọng!)

### Bước 1: Truy cập qua IP
Thay vì `http://localhost:3000`, hãy mở:
```
http://10.10.10.47:3000
```

### Bước 2: Đăng nhập hệ thống
- Kết nối MetaMask
- Đăng nhập

### Bước 3: Tạo QR Code
1. Vào tab **"Truy vết"**
2. Chọn sản phẩm (ví dụ: SP032)
3. Click icon **📱** để xem QR

### Bước 4: Quét bằng điện thoại
- Điện thoại phải cùng mạng Wifi (10.10.10.x)
- Mở camera/app quét QR
- Quét mã
- Trang web sẽ mở trên điện thoại!

---

## 🎨 Giao Diện Trang Truy Vết

### 📋 Phần 1: Header
- Logo GreenOrigin
- Slogan hệ thống

### 🖼️ Phần 2: Thông Tin Sản Phẩm
- **Badge xác thực**: ✅ Đã xác thực / 📝 Đang chờ
- **Ảnh sản phẩm**: Hiển thị lớn, đẹp mắt
- **Tên & Mô tả**: Rõ ràng, dễ đọc
- **Mã sản phẩm**: Định dạng đẹp

### 📊 Phần 3: Chi Tiết
- **Thông tin cơ bản**: Nông trại, ngày tạo, số bước
- **Xác thực Blockchain**: Nếu có trên blockchain
- **Chứng nhận**: Badges chuyên nghiệp

### 📜 Phần 4: Lịch Sử Truy Vết
- Timeline dạng dọc
- Mỗi bước với icon, action, địa điểm, thời gian
- Địa chỉ blockchain người thực hiện

### 🔐 Phần 5: Footer
- Badge bảo mật blockchain
- Copyright

---

## ⚙️ Cách Hoạt Động

```
[Sản phẩm] → [Tạo QR] → [In lên bao bì]
                ↓
         [Người tiêu dùng quét]
                ↓
    [Mở trang web trên điện thoại]
                ↓
         [Xem thông tin đầy đủ]
```

---

## 💡 Ưu Điểm Cách Này

### ✅ So với nhét thông tin vào QR:
1. **Không giới hạn dung lượng** - Hiển thị được hình ảnh, video
2. **Cập nhật được** - Thêm bước truy vết mới
3. **Giao diện đẹp** - Trải nghiệm tốt trên mobile
4. **SEO được** - Google có thể index
5. **Analytics được** - Theo dõi lượt xem

### 🏆 Chuyên nghiệp:
- ✅ Giống Vinamilk, TH True Milk
- ✅ Có thể scale lớn
- ✅ Dễ bảo trì
- ✅ Tích hợp blockchain

---

## 🚀 Nâng Cấp Sau Này

### Phase 2:
- [ ] Video giới thiệu nông trại
- [ ] Hình ảnh quy trình sản xuất
- [ ] Đánh giá/review từ người dùng
- [ ] Chia sẻ lên social media
- [ ] Multilanguage (EN, JP, KR)

### Phase 3:
- [ ] AR/VR tour nông trại
- [ ] Live tracking vận chuyển
- [ ] IoT sensors data
- [ ] AI phân tích chất lượng

---

## 📱 Screenshot Demo

### Desktop View:
- Giao diện full width
- Tất cả thông tin hiển thị rõ ràng

### Mobile View:
- Tự động responsive
- Touch-friendly
- Scroll mượt mà
- Load nhanh

---

## 🔧 Khắc Phục Sự Cố

### Không quét được?
1. Kiểm tra camera có quyền truy cập
2. Đảm bảo QR rõ nét
3. Đủ ánh sáng

### Không mở được trang?
1. Kiểm tra Wifi cùng mạng
2. Backend đang chạy
3. IP đúng (10.10.10.47)

### Không có ảnh?
- Ảnh cần có trong `/uploads/`
- Path đúng trong database

---

## 📞 Support
- Check backend: `http://localhost:5000/health`
- Check frontend: `http://10.10.10.47:3000`
- MongoDB connected: Xem log backend
