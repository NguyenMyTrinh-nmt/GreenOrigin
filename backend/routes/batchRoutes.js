const express = require('express');
const router = express.Router();
const { createBatch } = require('../controllers/batchController');

router.post('/', createBatch);

module.exports = router;
