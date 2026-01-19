import React, { useState } from 'react';
import './AddProduct.css';

function AddProduct() {
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  const [traceCode, setTraceCode] = useState('');
  const [description, setDescription] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên backend
    setSuccess(true);
  };

  return (
    <div className="add-product-container">
      <h2>Thêm sản phẩm mới</h2>
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mã lô sản xuất</label>
          <input type="text" value={batch} onChange={e => setBatch(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mã truy vết</label>
          <input type="text" value={traceCode} onChange={e => setTraceCode(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>
        <button className="submit-btn" type="submit">Thêm sản phẩm</button>
        {success && <div className="success-msg">✔️ Thêm sản phẩm thành công!</div>}
      </form>
    </div>
  );
}

export default AddProduct;
