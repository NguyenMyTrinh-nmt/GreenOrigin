const blockchainService = require('./services/blockchainService');
const Product = require('./models/Product');
const BatchMetadata = require('./models/BatchMetadata');
const mongoose = require('mongoose');

async function addSP001ToBlockchain() {
  try {
    require('dotenv').config();
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get product info
    const product = await Product.findOne({ productId: 'SP001' });
    if (!product) {
      console.log('❌ Product SP001 not found in database');
      process.exit(1);
    }

    console.log('📦 Product found:');
    console.log('   - Product ID:', product.productId);
    console.log('   - Name:', product.name);
    console.log('   - Location:', product.location);
    console.log('   - Supplier:', product.supplier);
    console.log('');

    // Check if already on blockchain
    console.log('🔍 Checking blockchain...');
    const exists = await blockchainService.isProductOnBlockchain('SP001');
    if (exists) {
      console.log('⚠️  SP001 already exists on blockchain!');
      process.exit(0);
    }
    console.log('✅ SP001 not on blockchain yet, proceeding...\n');

    // Add to blockchain
    console.log('📤 Adding SP001 to blockchain...');
    const result = await blockchainService.addProductToChain({
      productId: 'SP001',
      name: product.name,
      farm: product.location || product.supplier || 'Unknown Farm'
    });

    console.log('✅ Successfully added to blockchain!');
    console.log('   - Transaction Hash:', result.transactionHash);
    console.log('   - Block Number:', result.blockNumber);
    console.log('');

    // Update BatchMetadata
    console.log('💾 Updating BatchMetadata...');
    await BatchMetadata.findOneAndUpdate(
      { productId: 'SP001' },
      { 
        transactionHash: result.transactionHash,
        blockchainStatus: 'verified',
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('✅ BatchMetadata updated!\n');

    // Verify
    console.log('🔍 Verifying...');
    const verifyExists = await blockchainService.isProductOnBlockchain('SP001');
    console.log(`   Result: ${verifyExists ? '✅ SP001 IS on blockchain' : '❌ SP001 NOT on blockchain'}`);

    const blockchainData = await blockchainService.getProductFromChain('SP001');
    console.log('\n📊 Blockchain data:');
    console.log('   - Product ID:', blockchainData.productId);
    console.log('   - Name:', blockchainData.name);
    console.log('   - Farm:', blockchainData.farm);
    console.log('   - Trace Count:', blockchainData.traceCount);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addSP001ToBlockchain();
