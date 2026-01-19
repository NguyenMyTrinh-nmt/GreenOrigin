const express = require('express');
const router = express.Router();
const { requestNonce, verifySignature } = require('../controllers/authController');

router.post('/request-nonce', requestNonce);
router.post('/verify', verifySignature);

module.exports = router;
