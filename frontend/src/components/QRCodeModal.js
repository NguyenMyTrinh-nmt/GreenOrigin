import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './QRCodeModal.css';

function QRCodeModal({ productId, productName, onClose }) {
  // URL để quét QR code - dẫn đến trang public trace
  const qrUrl = `${window.location.origin}/trace/${productId}`;

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `QR_${productId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h2>📱 Mã QR Truy Vết</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="qr-modal-body">
          <div className="product-info">
            <h3>{productName}</h3>
            <p className="product-id">Mã: {productId}</p>
          </div>

          <div className="qr-code-container">
            <QRCodeSVG
              id="qr-code-svg"
              value={qrUrl}
              size={280}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>

          <div className="qr-instructions">
            <p>📷 Quét mã QR này bằng điện thoại để xem lịch sử truy vết sản phẩm</p>
            <div className="qr-url">
              <small>{qrUrl}</small>
            </div>
          </div>

          <div className="qr-actions">
            <button className="btn-download" onClick={handleDownloadQR}>
              📥 Tải xuống QR
            </button>
            <button className="btn-close-modal" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeModal;
