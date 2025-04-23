const mongoose = require('mongoose');

const bvnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bvn: String,
  first_name: String,
  last_name: String,
  date_of_birth: String,
  phone_number: String,
  gender: String,
  nin: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bvn', bvnSchema);
