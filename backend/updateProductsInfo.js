require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = process.env.MONGODB_URI;

async function updateAllProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    const locations = [
      'Ấp 3, Xã Thanh Hưng, Đông Thấp',
      'Ấp 2, Xã An Hữu, Đông Thấp', 
      'Ấp 1, Xã Tân Lợi, Đồng Tháp',
      'Ấp 4, Xã Bình Thành, Đồng Tháp'
    ];

    const packingLocations = [
      'Ấp 2, Xã An Hữu, Đông Thấp',
      'Khu công nghiệp Tân Lợi, Đồng Tháp',
      'Nhà máy chế biến Thanh Hưng',
      'Trung tâm đóng gói Bình Thành'
    ];

    const suppliers = [
      'HKD Nguyễn Văn Thi',
      'HTX Nông nghiệp Đồng Tháp',
      'Công ty TNHH Nông sản xanh',
      'Hợp tác xã Thanh Hưng'
    ];

    const certifications = [
      {
        name: 'VietGAP',
        standard: 'Bản Cam Kết, Sản Xuất, Kinh Doanh Thực Phẩm Nông Lâm Thủy Sản An Toàn',
        certificateNumber: 'FAO-VG-TT-82-22-06',
        validUntil: new Date('2025-12-26'),
        issuedBy: 'Sở Nông nghiệp và Phát triển nông thôn Đồng Tháp',
        documentUrl: ''
      },
      {
        name: 'Xác Nhận UBND Xã An Hữu',
        standard: 'Xác Nhận UBND Xã An Hữu CB-TG',
        certificateNumber: 'XN-AH-2025-001',
        validUntil: new Date('2025-12-31'),
        issuedBy: 'UBND Xã An Hữu',
        documentUrl: ''
      }
    ];

    let updated = 0;
    
    for (const product of products) {
      const randomLoc = locations[Math.floor(Math.random() * locations.length)];
      const randomPackLoc = packingLocations[Math.floor(Math.random() * packingLocations.length)];
      const randomSupplier = suppliers[Math.floor(Math.random() * suppliers.length)];
      
      // Tạo ngày thu hoạch (7-14 ngày trước)
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() - Math.floor(Math.random() * 7 + 7));
      
      // Ngày đóng gói (1-2 ngày sau thu hoạch)
      const packingDate = new Date(harvestDate);
      packingDate.setDate(packingDate.getDate() + Math.floor(Math.random() * 2 + 1));
      
      // Ngày giao hàng (1-2 ngày sau đóng gói)
      const deliveryDate = new Date(packingDate);
      deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 2 + 1));

      product.location = randomLoc;
      product.packingLocation = randomPackLoc;
      product.supplier = randomSupplier;
      product.lotNumber = `${product.location.split(',')[0].trim()} - Khu 03 - ${product.name}`;
      product.harvestDate = harvestDate;
      product.packingDate = packingDate;
      product.deliveryDate = deliveryDate;
      product.certifications = certifications;
      
      await product.save();
      updated++;
      
      console.log(`✅ Updated ${product.productId} - ${product.name}`);
    }

    console.log(`\n🎉 Successfully updated ${updated} products!`);
    
    // Hiển thị ví dụ một sản phẩm
    const sample = await Product.findOne({});
    console.log('\n📋 Sample product data:');
    console.log('Product ID:', sample.productId);
    console.log('Name:', sample.name);
    console.log('Supplier:', sample.supplier);
    console.log('Location:', sample.location);
    console.log('Packing Location:', sample.packingLocation);
    console.log('Lot Number:', sample.lotNumber);
    console.log('Harvest Date:', sample.harvestDate.toLocaleDateString('vi-VN'));
    console.log('Packing Date:', sample.packingDate.toLocaleDateString('vi-VN'));
    console.log('Delivery Date:', sample.deliveryDate.toLocaleDateString('vi-VN'));
    console.log('Certifications:', sample.certifications.length);

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAllProducts();
