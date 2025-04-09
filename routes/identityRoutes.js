const express = require('express');
const router = express.Router();
const { verifyIdentity } = require('../controllers/identityController');

router.post('/verify-identity', verifyIdentity);

module.exports = router;
