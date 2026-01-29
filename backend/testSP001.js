const blockchainService = require('./services/blockchainService');

async function testSP001() {
  try {
    console.log('🔍 Testing SP001 blockchain status...\n');
    
    // Test 1: Check if product exists on blockchain
    console.log('Test 1: isProductOnBlockchain()');
    const exists = await blockchainService.isProductOnBlockchain('SP001');
    console.log(`   Result: ${exists}`);
    console.log(`   ✅ SP001 ${exists ? 'EXISTS' : 'DOES NOT EXIST'} on blockchain\n`);
    
    // Test 2: Get product data from blockchain
    if (exists) {
      console.log('Test 2: getProductFromChain()');
      const product = await blockchainService.getProductFromChain('SP001');
      console.log('   Product data from blockchain:');
      console.log('   - Product ID:', product.productId);
      console.log('   - Name:', product.name);
      console.log('   - Farm:', product.farm);
      console.log('   - Created At:', new Date(product.createdAt * 1000).toLocaleString());
      console.log('   - Trace Count:', product.traceCount);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testSP001();
