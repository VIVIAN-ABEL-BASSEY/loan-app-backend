const Bvn = require('../models/Bvn');

exports.verifyBVNWithReference = async (req, res) => {
    try {
      const reference = req.params.reference;
      const response = await flutterwave.get(`/bvn/verifications/${reference}`);
      const bvnData = response.data.data;
      // ✅ Step 2: Check if this BVN already exists
      let existing = await Bvn.findOne({ bvn: bvnData.bvn });

      // ✅ Step 3: Save to MongoDB only if not already saved
      if (!existing) {
        await Bvn.create({
          // You can skip user linking for now if req.user is undefined
          bvn: bvnData.bvn,
          first_name: bvnData.first_name,
          last_name: bvnData.last_name,
          date_of_birth: bvnData.date_of_birth,
          phone_number: bvnData.phone_number,
          gender: bvnData.gender,
          nin: bvnData.nin
        });
      }
      
      return res.status(200).json({
        message: 'BVN verification successful',
        data: response.data.data
      });

    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).json({ message: 'Failed to fetch BVN data' });
    }
  };
  