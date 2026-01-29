const blockchainService = require('../services/blockchainService');
const BatchMetadata = require('../models/BatchMetadata');
const Product = require('../models/Product');

const REQUIRED_FIELDS = ['batchId', 'growerId', 'productName'];

exports.createBatch = async (req, res) => {
  try {
    const { batchId, growerId, productName, harvestDate } = req.body;
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    const harvestTimestamp = harvestDate
      ? Math.floor(new Date(harvestDate).getTime() / 1000)
      : Math.floor(Date.now() / 1000);

    const result = await blockchainService.createBatchOnChain({
      batchId,
      growerId,
      productName,
      harvestDate: harvestTimestamp
    });

    return res.status(201).json({
      success: true,
      message: 'Batch created on blockchain successfully',
      data: {
        batchId,
        growerId,
        productName,
        harvestTimestamp,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      }
    });
  } catch (error) {
    console.error('createBatch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to create batch on blockchain',
      error: error.message
    });
  }
};

// Thêm sản phẩm mới vào blockchain
exports.addProduct = async (req, res) => {
  try {
    const { productId, name, farm } = req.body;
    
    if (!productId || !name || !farm) {
      return res.status(400).json({
        success: false,
        message: 'productId, name, and farm are required'
      });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trên blockchain chưa
    try {
      const existingProduct = await blockchainService.getProductFromChain(productId);
      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'Sản phẩm đã tồn tại trên blockchain',
          error: 'Product already exists on blockchain'
        });
      }
    } catch (checkError) {
      // Product không tồn tại, tiếp tục thêm mới
    }

    const result = await blockchainService.addProductToChain({
      productId,
      name,
      farm
    });

    // Cập nhật BatchMetadata với transactionHash
    await BatchMetadata.findOneAndUpdate(
      { batch_id: productId },
      { 
        batch_id: productId,
        product_name: name,
        latest_transaction_hash: result.transactionHash
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Updated BatchMetadata for ${productId} with txHash: ${result.transactionHash}`);

    return res.status(201).json({
      success: true,
      message: 'Product added to blockchain successfully',
      data: {
        productId,
        name,
        farm,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      }
    });
  } catch (error) {
    console.error('addProduct error:', error);
    
    // Phân tích lỗi cụ thể
    let errorMessage = 'Unable to add product to blockchain';
    if (error.message.includes('Product already exists')) {
      errorMessage = 'Sản phẩm đã tồn tại trên blockchain';
    } else if (error.message.includes('insufficient funds')) {
      errorMessage = 'Không đủ gas fee để thực hiện giao dịch';
    } else if (error.message.includes('nonce')) {
      errorMessage = 'Lỗi nonce, vui lòng thử lại';
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

// Thêm bước truy vết
exports.addTrace = async (req, res) => {
  try {
    const { productId } = req.params;
    const { action, location } = req.body;
    
    if (!action || !location) {
      return res.status(400).json({
        success: false,
        message: 'action and location are required'
      });
    }

    // Kiểm tra xem sản phẩm đã có trên blockchain chưa
    let productExists = false;
    try {
      await blockchainService.getProductFromChain(productId);
      productExists = true;
    } catch (error) {
      // Product chưa có trên blockchain
    }

    // Nếu chưa có, tự động thêm sản phẩm vào blockchain trước
    if (!productExists) {
      const product = await Product.findOne({ productId: productId });
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Sản phẩm không tồn tại trong hệ thống'
        });
      }

      // Tự động thêm sản phẩm vào blockchain
      try {
        await blockchainService.addProductToChain({
          productId: productId,
          name: product.name,
          farm: product.location || product.farmerName || 'Chưa cập nhật'
        });
      } catch (addError) {
        return res.status(500).json({
          success: false,
          message: 'Không thể thêm sản phẩm vào blockchain. Vui lòng thêm sản phẩm vào blockchain trước (nút 🔗)',
          error: addError.message
        });
      }
    }

    // Thêm trace vào blockchain
    const result = await blockchainService.addTraceToChain({
      productId,
      action,
      location
    });

    return res.status(201).json({
      success: true,
      message: 'Trace added to blockchain successfully',
      data: {
        productId,
        action,
        location,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      }
    });
  } catch (error) {
    console.error('addTrace error:', error);
    
    let errorMessage = 'Unable to add trace to blockchain';
    if (error.message.includes('Product not found')) {
      errorMessage = 'Sản phẩm chưa được thêm vào blockchain. Vui lòng thêm sản phẩm trước (nút 🔗)';
    } else if (error.message.includes('insufficient funds')) {
      errorMessage = 'Không đủ gas fee';
    }
    
    return res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
};

// Đồng bộ trạng thái blockchain
exports.syncBlockchainStatus = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra blockchain
    const existsOnChain = await blockchainService.isProductOnBlockchain(productId);
    
    // Cập nhật BatchMetadata (chỉ nếu đã tồn tại)
    if (existsOnChain) {
      await BatchMetadata.findOneAndUpdate(
        { batch_id: productId },
        { 
          latest_transaction_hash: 'verified-on-blockchain'
        },
        { upsert: false }
      );
    }

    console.log(`✅ Synced ${productId}: isOnBlockchain=${existsOnChain}`);

    return res.json({
      success: true,
      productId,
      isOnBlockchain: existsOnChain
    });

  } catch (error) {
    console.error('syncBlockchainStatus error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy thông tin sản phẩm từ blockchain hoặc database
exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`🔍 Getting product: ${productId}`);
    
    // Luôn lấy thông tin từ database trước (có đầy đủ nhất)
    const product = await Product.findOne({ productId: productId });
    const batchMetadata = await BatchMetadata.findOne({ batch_id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Kiểm tra blockchain status
    let isOnBlockchain = false;
    let transactionHash = batchMetadata?.latest_transaction_hash || null;
    let blockchainData = null;
    
    try {
      isOnBlockchain = await blockchainService.isProductOnBlockchain(productId);
      
      if (isOnBlockchain) {
        blockchainData = await blockchainService.getProductFromChain(productId);
        console.log(`✅ Product ${productId} verified on blockchain`);
      }
    } catch (blockchainError) {
      console.log(`⚠️ Could not check blockchain for ${productId}:`, blockchainError.message);
      isOnBlockchain = false;
    }

    // Merge dữ liệu: Lấy từ Product (đầy đủ) + thêm thông tin blockchain nếu có
    const productInfo = {
      productId: productId,
      name: product.name || 'Unknown',
      farm: product.location || product.farmerName || 'Unknown',
      createdAt: product.createdAt ? Math.floor(new Date(product.createdAt).getTime() / 1000) : Math.floor(Date.now() / 1000),
      traceCount: blockchainData?.traceCount || 0,
      
      // Thông tin chi tiết từ Product (quan trọng nhất)
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      
      // Thông tin nhà cung cấp và địa điểm (chỉ từ Product)
      supplier: product.supplier || '',
      farmerName: product.farmerName || '',
      location: product.location || '',
      packingLocation: product.packingLocation || '',
      lotNumber: product.lotNumber || productId,
      
      // Ngày tháng (chỉ từ Product)
      harvestDate: product.harvestDate,
      packingDate: product.packingDate,
      deliveryDate: product.deliveryDate,
      
      // Chứng nhận (chỉ từ Product)
      certifications: product.certifications || [],
      
      // Thông tin khác
      category: product.category,
      quantity: product.quantity,
      unit: product.unit,
      
      // Blockchain info
      isOnBlockchain: isOnBlockchain,
      transactionHash: transactionHash
    };

    return res.status(200).json({
      success: true,
      data: productInfo,
      source: isOnBlockchain ? 'blockchain+database' : 'database',
      message: isOnBlockchain ? 
        'Sản phẩm đã được xác thực trên blockchain' : 
        'Sản phẩm chưa có trên blockchain'
    });
  } catch (error) {
    console.error('getProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to get product information',
      error: error.message
    });
  }
};

// Lấy tất cả bước truy vết của sản phẩm
exports.getTraces = async (req, res) => {
  try {
    const { productId } = req.params;
    
    try {
      const traces = await blockchainService.getAllTracesFromChain(productId);
      return res.status(200).json({
        success: true,
        data: traces,
        total: traces.length,
        source: 'blockchain'
      });
    } catch (blockchainError) {
      // No traces yet (expected for products not on blockchain)
      return res.status(200).json({
        success: true,
        data: [],
        total: 0,
        source: 'database',
        message: 'No traces yet. Product may not be on blockchain.'
      });
    }
  } catch (error) {
    console.error('getTraces error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to get traces',
      error: error.message
    });
  }
};

// Lấy danh sách tất cả các batch từ database
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await BatchMetadata.find()
      .sort({ createdAt: -1 })
      .select('batch_id product_name latest_transaction_hash createdAt');
    
    return res.status(200).json({
      success: true,
      data: batches,
      total: batches.length
    });
  } catch (error) {
    console.error('getAllBatches error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to get batches',
      error: error.message
    });
  }
};

// Lấy thống kê
exports.getStats = async (req, res) => {
  try {
    const totalBatches = await BatchMetadata.countDocuments();
    
    // Đếm tổng số traces từ blockchain cho tất cả các products
    let totalTraces = 0;
    const batches = await BatchMetadata.find().select('batch_id');
    
    for (const batch of batches) {
      try {
        const product = await blockchainService.getProductFromChain(batch.batch_id);
        totalTraces += product.traceCount;
      } catch (error) {
        // Skip products not on blockchain (expected)
      }
    }
    
    return res.status(200).json({
      success: true,
      data: {
        totalBatches,
        totalTraces,
        verified: totalBatches, // Tạm thời coi tất cả đều đã verify
        transactions: totalBatches + totalTraces
      }
    });
  } catch (error) {
    console.error('getStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to get stats',
      error: error.message
    });
  }
};
