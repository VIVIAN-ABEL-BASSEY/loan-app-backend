const express = require('express');
const router = express.Router();
const { verifyBVNWithReference } = require('../controllers/verifyController');

router.get('/verify-bvn/:reference', verifyBVNWithReference);

const { verifyIdentity } = require('../controllers/identityController');

router.post('/verify-identity', verifyIdentity);

module.exports = router;
