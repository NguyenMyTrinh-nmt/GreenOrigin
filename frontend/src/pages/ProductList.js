import React from 'react';
import './ProductList.css';

const mockProducts = [
  {
    id: 'P001',
    name: 'Gạo ST25',
    batch: 'LO20251224',
    traceCode: 'TRC-0001',
    description: 'Gạo thơm đặc sản Sóc Trăng',
    createdAt: '24/12/2025',
  },
  {
    id: 'P002',
    name: 'Xoài Cát Hòa Lộc',
    batch: 'LO20251223',
    traceCode: 'TRC-0002',
    description: 'Xoài ngọt, xuất xứ Tiền Giang',
    createdAt: '23/12/2025',
  },
];

function ProductList() {
  return (
    <div className="product-list-container">
      <h2>Danh sách sản phẩm</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Mã lô</th>
            <th>Mã truy vết</th>
            <th>Mô tả</th>
            <th>Ngày tạo</th>
          </tr>
        </thead>
        <tbody>
          {mockProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.batch}</td>
              <td>{p.traceCode}</td>
              <td>{p.description}</td>
              <td>{p.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
