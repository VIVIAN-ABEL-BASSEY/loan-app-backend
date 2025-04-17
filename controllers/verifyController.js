exports.verifyBVNWithReference = async (req, res) => {
    try {
      const reference = req.params.reference;
  
      const response = await flutterwave.get(`/bvn/verifications/${reference}`);
  
      return res.status(200).json({
        message: 'BVN verification successful',
        data: response.data.data
      });
  
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ message: 'Failed to fetch BVN data' });
    }
  };
  