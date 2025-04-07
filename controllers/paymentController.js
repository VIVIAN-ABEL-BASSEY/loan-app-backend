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

exports.verifyCardBinding = async (req, res) => {
  const reference = req.query.reference;

  if (!reference) {
    return res.status(400).json({ message: 'Transaction reference is required' });
  }

  try {
    const response = await paystack.get(`/transaction/verify/${reference}`);
    const data = response.data.data;

    if (data.status === 'success') {
      // Here you can store card info or update user record in DB
      return res.status(200).json({ message: 'Card binding successful', data });
    } else {
      return res.status(400).json({ message: 'Card binding failed' });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to verify card binding' });
  }
};

