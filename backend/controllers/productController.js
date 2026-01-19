const Product = require('../models/Product');
const blockchainService = require('../services/blockchainService');

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

    // Tạo batch trên blockchain (optional)
    try {
      const harvestTimestamp = Math.floor(new Date(product.harvestDate).getTime() / 1000);
      await blockchainService.createBatchOnChain({
        batchId: productId,
        growerId: farmerId,
        productName: name,
        harvestDate: harvestTimestamp
      });
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

    // Update fields
    const allowedUpdates = [
      'name',
      'category',
      'description',
      'location',
      'quantity',
      'unit',
      'status'
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
