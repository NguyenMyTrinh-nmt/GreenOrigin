const express = require('express');
const router = express.Router();
const { requestNonce, verifySignature, loginWithCredentials } = require('../controllers/authController');

router.post('/request-nonce', requestNonce);
router.post('/verify', verifySignature);
router.post('/login', loginWithCredentials);

module.exports = router;
