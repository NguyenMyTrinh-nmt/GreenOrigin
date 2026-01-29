require('dotenv').config();
const mongoose = require('mongoose');
const batchController = require('./controllers/batchController');

async function testGetProduct() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Mock request and response objects
    const req = {
      params: { productId: 'SP001' }
    };

    const res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        console.log('📊 API Response for SP001:');
        console.log('Status Code:', this.statusCode || 200);
        console.log('\n=== Response Data ===');
        console.log(JSON.stringify(data, null, 2));
        
        if (data.success && data.data) {
          console.log('\n=== Key Fields ===');
          console.log('isOnBlockchain:', data.data.isOnBlockchain);
          console.log('transactionHash:', data.data.transactionHash);
          console.log('source:', data.source);
          console.log('supplier:', data.data.supplier);
          console.log('location:', data.data.location);
          console.log('certifications:', data.data.certifications?.length || 0);
        }
        
        process.exit(0);
      }
    };

    // Call the controller
    await batchController.getProduct(req, res);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testGetProduct();
