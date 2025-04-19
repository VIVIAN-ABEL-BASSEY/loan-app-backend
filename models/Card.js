const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: true,
  },
  authorization: {
    authorization_code: String,
    bin: String,
    last4: String,
    exp_month: String,
    exp_year: String,
    channel: String,
    card_type: String,
    bank: String,
    country_code: String
  },
  customer_id: Number,
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);
