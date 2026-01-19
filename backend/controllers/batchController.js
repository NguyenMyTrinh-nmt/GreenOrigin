const blockchainService = require('../services/blockchainService');

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
