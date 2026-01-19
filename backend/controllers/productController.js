const Product = require('../models/Product');
const { contract } = require('../config/blockchain');

// @desc    Tạo sản phẩm mới
// @route   POST /api/products
// @access  Private (Farmer, Processor)
exports.createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      category,
      description,
      origin,
      harvestDate,
      quantity,
      certifications
    } = req.body;

    // Kiểm tra productId đã tồn tại
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'Mã sản phẩm đã tồn tại'
      });
    }

    // Tạo sản phẩm trong database
    const product = await Product.create({
      productId,
      name,
      category,
      description,
      origin,
      farmer: req.user._id,
      harvestDate,
      quantity,
      certifications,
      images: req.files ? req.files.map(file => file.path) : []
    });

    // Ghi lên blockchain (nếu có contract)
    if (contract) {
      try {
        const tx = await contract.addProduct(
          productId,
          name,
          `${origin.province}, ${origin.district}`
        );
        const receipt = await tx.wait();
        
        // Cập nhật transaction hash
        product.blockchainTxHash = receipt.hash;
        await product.save();
      } catch (blockchainError) {
        console.error('Blockchain error:', blockchainError);
        // Vẫn trả về product mặc dù blockchain fail
      }
    }

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy tất cả sản phẩm
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, status, farmer, search } = req.query;
    
    // Build query
    let query = {};
    
    if (category) query.category = category;
    if (status) query.status = status;
    if (farmer) query.farmer = farmer;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('farmer', 'name email role walletAddress')
      .sort('-createdAt');

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy chi tiết sản phẩm theo ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('farmer', 'name email role phoneNumber address walletAddress');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Lấy sản phẩm theo productId (mã sản phẩm)
// @route   GET /api/products/code/:productId
// @access  Public
exports.getProductByCode = async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId })
      .populate('farmer', 'name email role phoneNumber address walletAddress');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật sản phẩm
// @route   PUT /api/products/:id
// @access  Private (Owner hoặc Admin)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra quyền sở hữu
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật sản phẩm này'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Xóa sản phẩm
// @route   DELETE /api/products/:id
// @access  Private (Owner hoặc Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Kiểm tra quyền sở hữu
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa sản phẩm này'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// @desc    Cập nhật trạng thái sản phẩm
// @route   PUT /api/products/:id/status
// @access  Private
exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    product.status = status;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};
