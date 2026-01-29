// Script để sync Products sang BatchMetadata
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const BatchMetadata = require('./models/BatchMetadata');

const syncProductsToBatches = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Lấy tất cả products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);

    let synced = 0;
    let skipped = 0;

    for (const product of products) {
      // Kiểm tra xem đã có BatchMetadata chưa
      const existing = await BatchMetadata.findOne({ batch_id: product.productId });
      
      if (existing) {
        console.log(`⏭️  Skipped ${product.productId} - already exists`);
        skipped++;
        continue;
      }

      // Tạo BatchMetadata mới
      const batchMetadata = new BatchMetadata({
        batch_id: product.productId,
        product_name: product.name,
        latest_transaction_hash: 'synced-' + Date.now(),
        owner_id: product._id,
        image_url: product.imageUrl || '',
        description: product.description || ''
      });

      await batchMetadata.save();
      console.log(`✅ Synced ${product.productId}`);
      synced++;
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Synced: ${synced}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   📦 Total: ${products.length}`);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

syncProductsToBatches();
