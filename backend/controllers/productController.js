const Product = require('../models/Product');
const BatchMetadata = require('../models/BatchMetadata');
const ProductUpdate = require('../models/ProductUpdate');
const blockchainService = require('../services/blockchainService');
const crypto = require('crypto');

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      description,
      farmerId,
      farmerName,
      location,
      harvestDate,
      quantity,
      unit
    } = req.body;

    // Validate required fields
    if (!productId || !name || !farmerId) {
      return res.status(400).json({
        success: false,
        message: 'productId, name, and farmerId are required'
      });
    }

    // Kiểm tra product đã tồn tại chưa
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Product with this ID already exists'
      });
    }

    // Lấy đường dẫn ảnh nếu có upload
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    // Tạo product trong database
    const product = new Product({
      productId,
      name,
      category,
      description,
      farmerId,
      farmerName,
      location,
      harvestDate: harvestDate ? new Date(harvestDate) : new Date(),
      quantity,
      unit,
      imageUrl,
      createdBy: req.user.walletAddress
    });

    await product.save();

    // Tạo batch trên blockchain và lưu metadata
    let transactionHash = '';
    try {
      const harvestTimestamp = Math.floor(new Date(product.harvestDate).getTime() / 1000);
      const blockchainResult = await blockchainService.createBatchOnChain({
        batchId: productId,
        growerId: farmerId,
        productName: name,
        harvestDate: harvestTimestamp
      });
      transactionHash = blockchainResult.transactionHash;

      // Tạo BatchMetadata để có thể truy vết
      const batchMetadata = new BatchMetadata({
        batch_id: productId,
        product_name: name,
        latest_transaction_hash: transactionHash,
        owner_id: product._id,
        image_url: imageUrl,
        description: description
      });
      await batchMetadata.save();
    } catch (blockchainError) {
      console.error('Blockchain error (non-critical):', blockchainError.message);
      // Không fail nếu blockchain lỗi, vẫn lưu được vào database
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('createProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, farmerId } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (farmerId) filter.farmerId = farmerId;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('getAllProducts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('getProductById error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields - bao gồm cả các trường mới
    const allowedUpdates = [
      'name',
      'category',
      'description',
      'location',
      'quantity',
      'unit',
      'status',
      'supplier',
      'packingLocation',
      'lotNumber',
      'harvestDate',
      'packingDate',
      'deliveryDate',
      'certifications'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    // Cập nhật ảnh nếu có upload mới
    if (req.file) {
      // Xóa ảnh cũ nếu có
      if (product.imageUrl) {
        const fs = require('fs');
        const path = require('path');
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    product.updatedAt = Date.now();
    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('updateProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Cập nhật sản phẩm theo productId (SP001, SP002...) - APPEND-ONLY
exports.updateProductByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Xác định các field đã thay đổi
    const updatedFields = {};
    const allowedUpdates = [
      'name',
      'supplier',
      'farmerName',
      'location',
      'packingLocation',
      'lotNumber',
      'harvestDate',
      'packingDate',
      'deliveryDate',
      'certifications',
      'description'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        updatedFields[field] = req.body[field];
        product[field] = req.body[field];
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    // Lưu product (vẫn cần để có dữ liệu đầy đủ cho query nhanh)
    product.updatedAt = Date.now();
    await product.save();

    // Tạo snapshot đầy đủ tại thời điểm này
    const snapshot = {
      name: product.name,
      supplier: product.supplier,
      farmerName: product.farmerName,
      location: product.location,
      packingLocation: product.packingLocation,
      lotNumber: product.lotNumber,
      harvestDate: product.harvestDate,
      packingDate: product.packingDate,
      deliveryDate: product.deliveryDate,
      certifications: product.certifications,
      description: product.description,
      imageUrl: product.imageUrl
    };

    // Tạo hash của snapshot
    const dataToHash = JSON.stringify({
      productId,
      snapshot,
      timestamp: Date.now()
    });
    const blockchainHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    // Tạo bản ghi lịch sử (APPEND-ONLY)
    const productUpdate = new ProductUpdate({
      productId,
      updateType: req.body.certifications ? 'UPDATE_CERTIFICATION' : 
                  (req.body.harvestDate || req.body.packingDate) ? 'UPDATE_DATES' : 
                  'UPDATE_INFO',
      updatedFields,
      snapshot,
      blockchainHash,
      updatedBy: req.user?.walletAddress || 'system',
      reason: req.body.reason || 'Cập nhật thông tin sản phẩm',
      timestamp: new Date()
    });

    await productUpdate.save();

    // (Optional) Ghi hash lên blockchain để bảo mật
    // Có thể thêm sau nếu cần xác thực nghiêm ngặt

    // Cập nhật BatchMetadata
    try {
      await BatchMetadata.updateOne(
        { batch_id: productId },
        { 
          product_name: product.name,
          description: product.description,
          image_url: product.imageUrl
        }
      );
    } catch (batchError) {
      console.log('BatchMetadata update skipped:', batchError.message);
    }

    return res.status(200).json({
      success: true,
      message: 'Cập nhật thành công (đã tạo bản ghi mới)',
      data: {
        product,
        updateRecord: {
          id: productUpdate._id,
          blockchainHash,
          timestamp: productUpdate.timestamp,
          updatedFields: Object.keys(updatedFields)
        }
      }
    });
  } catch (error) {
    console.error('updateProductByProductId error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Lấy lịch sử cập nhật sản phẩm (để hiển thị timeline)
exports.getProductUpdateHistory = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const updates = await ProductUpdate.find({ productId })
      .sort({ timestamp: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      data: updates,
      total: updates.length
    });
  } catch (error) {
    console.error('getProductUpdateHistory error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch update history',
      error: error.message
    });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Xóa ảnh nếu có
    if (product.imageUrl) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '..', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('deleteProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};
