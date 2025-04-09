const flutterwave = require('../utils/flutterwave');

exports.verifyIdentity = async (req, res) => {
  const { type, value } = req.body;

  if (!type || !value) {
    return res.status(400).json({ message: "Both type and value are required" });
  }

  try {
    let response;

    if (type === 'bvn') {
      response = await flutterwave.get(`/kyc/bvns/${value}`);
    } else if (type === 'nin') {
      response = await flutterwave.post(`/kyc/nin`, { nin: value });
    } else {
      return res.status(400).json({ message: "Unsupported identity type" });
    }
    const result = response.data;
    return res.status(200).json({
      message: `${type.toUpperCase()} verification successful`,
    //   data: response.data.data
      data: result.data 
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: `Failed to verify ${type}` });
  }
};
