const flutterwave = require('../utils/flutterwave');

exports.verifyIdentity = async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ message: "Both type and value are required" });
  }

  try {
    // let response;
    if (type === 'bvn') {
      const { firstname, lastname } = req.body;
    
      if (!value || !firstname || !lastname) {
        return res.status(400).json({
          message: 'BVN, firstname, and lastname are required'
        });
      }
    
      const response = await flutterwave.post('/bvn/verifications', {
        bvn: value,
        firstname,
        lastname,
        redirect_url: 'https://example.com/after-consent' // You can change this later
      });
    
      return res.status(200).json({
        message: 'Consent initiated. Redirect user to URL to complete verification.',
        reference: response.data.data.reference,
        url: response.data.data.url
      });
    }
    
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: `Failed to verify ${type}` });
  }
};
