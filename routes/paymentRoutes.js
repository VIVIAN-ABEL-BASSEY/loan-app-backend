const express = require('express');
const router = express.Router();
const { initiateCardBinding } = require('../controllers/paymentController');
router.post('/initiate-card-binding', initiateCardBinding);
const { verifyCardBinding } = require('../controllers/paymentController');
router.get('/verify-card-binding', verifyCardBinding);
const { checkCardBinding } = require('../controllers/paymentController');
router.get('/check-card/:userId', checkCardBinding);


module.exports = router;
