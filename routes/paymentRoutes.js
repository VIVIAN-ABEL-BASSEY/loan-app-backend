const express = require('express');
const router = express.Router();
const { initiateCardBinding } = require('../controllers/paymentController');
router.post('/initiate-card-binding', initiateCardBinding);

module.exports = router;
