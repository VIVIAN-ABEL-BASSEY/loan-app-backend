
const Card = require('../models/Card');
const paystack = require('../utils/paystack');
const User = require("../models/User")

exports.initiateCardBinding = async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ message: 'Email and amount are required' });
    }

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: amount * 100,
      channels: ['card'] ,// 🎯 This limits options to only card
      // Optional: set a redirect URL
      callback_url: 'https://checkout.paystack.com' 
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
      // Save to DB
      const user = await User.findOne({ email: data.customer.email });
      if (!user) {
        return res.status(404).json({
          message: 'User not found for this card binding'
        });
      }
      await Card.create({
        user: user._id,
        email: data.customer.email,
        reference: data.reference,
        authorization: data.authorization,
        customer_id: data.customer.id,
      });
      //  Update user status to show card is linked
      await User.findByIdAndUpdate(user._id, { debitCardLinked: true });
     
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

exports.checkCardBinding = async (req, res) => {
  try {
    const userId = req.params.userId;
    const card = await Card.findOne({ user: userId });
    // const card = await Card.findOne({_id: userId });
    console.log(card)
    if (!card) {
      return res.status(200).json({
        bound: false,
        message: 'User has not bound a card yet'
      });
    }

    // Optional: Also update User if needed
    await User.findByIdAndUpdate(userId, { debitCardLinked: true });
    return res.status(200).json({
      bound: true,
      card: {
        brand: card.brand,
        last4: card.last4,
        expiry: card.expiry,
        bank: card.bank
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to check card binding status' });
  }
};
