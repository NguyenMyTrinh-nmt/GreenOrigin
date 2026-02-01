# 🔧 Hướng dẫn cấu hình QR Code cho mạng LAN

## ❌ Vấn đề

Khi quét QR code từ điện thoại:
- ✅ Trên máy bạn: QR code hoạt động → có thông tin
- ❌ Trên máy mình: QR code quay mãi → không có thông tin

**Nguyên nhân:** QR code chứa `localhost` hoặc IP cũ, điện thoại không truy cập được.

---

## ✅ Giải pháp

### Bước 1: Tìm IP của máy tính

**Windows:**
```bash
ipconfig
```
Tìm dòng `IPv4 Address` (ví dụ: `172.15.0.10`)

**Mac/Linux:**
```bash
ifconfig
# hoặc
ip addr show
```

### Bước 2: Cấu hình Frontend

Mở file `frontend/.env` và cập nhật:

```env
# Thay 172.15.0.10 bằng IP thật của máy bạn
REACT_APP_API_URL=http://172.15.0.10:5000/api
REACT_APP_BACKEND_URL=http://172.15.0.10:5000
REACT_APP_FRONTEND_URL=http://172.15.0.10:3000
```

### Bước 3: Cấu hình Backend CORS

Mở `backend/server.js` và kiểm tra:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://172.15.0.10:3000'  // ✅ IP của bạn
  ],
  credentials: true
}));
```

### Bước 4: Khởi động lại

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm start
```

### Bước 5: Truy cập từ IP thật

**Quan trọng:** Mở trình duyệt và truy cập:
```
http://172.15.0.10:3000
```

❌ **KHÔNG dùng** `http://localhost:3000`

### Bước 6: Tạo QR code mới

1. Đăng nhập vào hệ thống qua IP (http://172.15.0.10:3000)
2. Vào menu **Sản phẩm**
3. Nhấn nút **QR Code** trên sản phẩm
4. QR code mới sẽ chứa: `http://172.15.0.10:3000/trace/SP001`
5. Tải xuống và in QR mới

---

## 📱 Test QR Code

### Điều kiện để QR hoạt động:

1. ✅ Điện thoại và máy tính **cùng WiFi**
2. ✅ Backend đang chạy (port 5000)
3. ✅ Frontend đang chạy (port 3000)
4. ✅ Firewall không chặn port 3000 & 5000
5. ✅ QR code được tạo sau khi đã cấu hình IP

### Test bằng điện thoại:

1. Kết nối WiFi giống máy tính
2. Mở trình duyệt điện thoại
3. Truy cập: `http://172.15.0.10:3000`
4. Nếu thấy trang web → OK!
5. Quét QR code → Xem được thông tin sản phẩm

---

## 🐛 Troubleshooting

### 1. Không kết nối được từ điện thoại

**Kiểm tra Firewall:**

Windows:
```powershell
# Cho phép Node.js qua firewall
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes

# Hoặc tắt firewall tạm thời để test
```

### 2. QR vẫn chứa localhost

- Đảm bảo đã khởi động lại frontend
- Clear cache trình duyệt: Ctrl + Shift + Delete
- Tạo lại QR code

### 3. API không gọi được

Mở Console (F12) và kiểm tra:
```javascript
console.log(process.env.REACT_APP_API_URL);
// Phải hiển thị: http://172.15.0.10:5000/api
```

Nếu hiển thị `undefined` → Frontend chưa đọc được .env → Khởi động lại

### 4. CORS error

Backend console hiển thị:
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Sửa:** Thêm IP vào CORS trong `backend/server.js`

---

## 🔄 Quy trình đúng

### Developer (máy của bạn):

```
1. Tìm IP máy: 172.15.0.10
2. Cấu hình .env với IP này
3. Khởi động lại frontend & backend
4. Truy cập: http://172.15.0.10:3000
5. Tạo QR code → QR chứa IP thật
6. In/gửi QR cho người khác
```

### User (người quét QR):

```
1. Kết nối cùng WiFi với máy developer
2. Quét QR code
3. Tự động mở: http://172.15.0.10:3000/trace/SP001
4. Xem được thông tin sản phẩm
```

---

## 📝 Lưu ý

### Development vs Production

**Development (trong văn phòng/nhà):**
```env
REACT_APP_FRONTEND_URL=http://172.15.0.10:3000
```

**Production (deploy lên server):**
```env
REACT_APP_FRONTEND_URL=https://greenorigin.com
```

### Nếu IP thay đổi

Khi IP WiFi thay đổi:
1. Cập nhật `.env`
2. Khởi động lại frontend/backend
3. Tạo lại QR code

---

## ✅ Checklist

Trước khi tạo QR code, đảm bảo:

- [ ] Đã tìm IP máy tính
- [ ] Đã cấu hình `frontend/.env`
- [ ] Đã cấu hình CORS trong `backend/server.js`
- [ ] Đã khởi động lại backend & frontend
- [ ] Truy cập qua IP thật (không dùng localhost)
- [ ] Test từ điện thoại: mở được trang web
- [ ] Tạo QR mới (QR cũ vẫn chứa localhost)

---

**Cập nhật:** 01/02/2026
