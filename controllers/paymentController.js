const paystack = require('../utils/paystack');

exports.initiateCardBinding = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: 'Email and amount are required' });
    }

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amount * 100, // Paystack uses kobo, so convert Naira to Kobo
    });

    return res.status(200).json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate card binding' });
  }
};
