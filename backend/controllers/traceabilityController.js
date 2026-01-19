const TraceabilityRecord = require('../models/TraceabilityRecord');
const Product = require('../models/Product');
const { contract } = require('../config/blockchain');

// @desc    Thêm bản ghi truy vết
// @route   POST /api/traceability
// @access  Private
exports.addTraceRecord = async (req, res) => {
  try {
    const {
      productId,
      stage,
      title,
      description,
      location,
      metadata
    } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Tạo bản ghi truy vết
    const traceRecord = await TraceabilityRecord.create({
      product: product._id,
      productId,
      stage,
      title,
      description,
      location,
      performer: req.user._id,
      performerInfo: {
        name: req.user.name,
        role: req.user.role,
        walletAddress: req.user.walletAddress
      },
      images: req.files ? req.files.map(file => file.path) : [],
      metadata
    });

    // Ghi lên blockchain (nếu có contract)
    if (contract) {
      try {
        const tx = await contract.addTraceRecord(
          productId,
          stage,
          location.address || location.province,
          description
        );
        const receipt = await tx.wait();
        
        traceRecord.blockchainTxHash = receipt.hash;
        await traceRecord.save();
      } catch (blockchainError) {
        console.error('Blockchain error:', blockchainError);
      }
    }

    // Populate thông tin performer
    await traceRecord.populate('performer', 'name email role walletAddress');

    res.status(201).json({
      success: true,
      data: traceRecord
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

// @desc    Lấy tất cả bản ghi truy vết của sản phẩm
// @route   GET /api/traceability/:productId
// @access  Public
exports.getTraceRecords = async (req, res) => {
  try {
    const { productId } = req.params;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    const traceRecords = await TraceabilityRecord.find({ productId })
      .populate('performer', 'name email role phoneNumber walletAddress')
      .sort('timestamp');

    res.json({
      success: true,
      count: traceRecords.length,
      data: traceRecords
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

// @desc    Lấy chi tiết một bản ghi truy vết
// @route   GET /api/traceability/record/:id
// @access  Public
exports.getTraceRecordById = async (req, res) => {
  try {
    const traceRecord = await TraceabilityRecord.findById(req.params.id)
      .populate('performer', 'name email role phoneNumber address walletAddress')
      .populate('product', 'productId name category');

    if (!traceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi'
      });
    }

    res.json({
      success: true,
      data: traceRecord
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

// @desc    Cập nhật bản ghi truy vết
// @route   PUT /api/traceability/record/:id
// @access  Private (Owner hoặc Admin)
exports.updateTraceRecord = async (req, res) => {
  try {
    let traceRecord = await TraceabilityRecord.findById(req.params.id);

    if (!traceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi'
      });
    }

    // Kiểm tra quyền sở hữu
    if (traceRecord.performer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật bản ghi này'
      });
    }

    traceRecord = await TraceabilityRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('performer', 'name email role walletAddress');

    res.json({
      success: true,
      data: traceRecord
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

// @desc    Xóa bản ghi truy vết
// @route   DELETE /api/traceability/record/:id
// @access  Private (Admin only)
exports.deleteTraceRecord = async (req, res) => {
  try {
    const traceRecord = await TraceabilityRecord.findById(req.params.id);

    if (!traceRecord) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bản ghi'
      });
    }

    // Chỉ admin mới có quyền xóa
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa bản ghi'
      });
    }

    await traceRecord.deleteOne();

    res.json({
      success: true,
      message: 'Đã xóa bản ghi'
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

// @desc    Lấy timeline đầy đủ của sản phẩm
// @route   GET /api/traceability/:productId/timeline
// @access  Public
exports.getProductTimeline = async (req, res) => {
  try {
    const { productId } = req.params;

    // Lấy thông tin sản phẩm
    const product = await Product.findOne({ productId })
      .populate('farmer', 'name email role phoneNumber address walletAddress');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm'
      });
    }

    // Lấy tất cả bản ghi truy vết
    const traceRecords = await TraceabilityRecord.find({ productId })
      .populate('performer', 'name email role phoneNumber walletAddress')
      .sort('timestamp');

    res.json({
      success: true,
      data: {
        product,
        timeline: traceRecords
      }
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
