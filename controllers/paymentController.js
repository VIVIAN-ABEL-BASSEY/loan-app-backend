const paystack = require('../utils/paystack');

exports.initiateCardBinding = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: 'Email and amount are required' });
    }

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amount * 100,
      // Optional: set a redirect URL
      // callback_url: 'https://your-frontend-domain.com/payment-status' 
    });

    // Log the full response
    console.log('Paystack Init Response:', response.data);

    return res.status(200).json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference, // include it in the response
    });
  } catch (error) {
    console.error('Error initiating card binding:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate card binding' });
  }
};

exports.verifyCardBinding = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }

    // Verify the transaction with Paystack
    const response = await paystack.get(`/transaction/verify/${reference}`);
    const data = response.data.data;

    // Check if transaction was successful
    if (data.status === 'success') {
      // Here you can save user info or card auth to MongoDB
      console.log('Verification Successful:', data);

      // For now, just return success response
      return res.status(200).json({
        message: 'Card binding verified successfully',
        reference: data.reference,
        authorization: data.authorization, // this contains card binding info
        customer: data.customer
      });
    } else {
      return res.status(400).json({ message: 'Verification failed', data });
    }
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Error verifying card binding' });
  }
};
