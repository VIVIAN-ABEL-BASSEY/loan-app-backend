const User = require('../models/User');
const Group = require('../models/Group');
const Payment = require('../models/Transaction'); // Make sure this exists

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    // const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    const imagePath = req.file.path; 
    if (!imagePath) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imagePath },
      { new: true }
    );

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
};


exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select(
      'Firstname Surname Middlename email Phonenumber Location rating profilePicture'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get count of groups joined
    const groupsJoined = await Group.countDocuments({ members: userId });

    // Get count of completed payments
    const completedPayments = await Payment.countDocuments({
      user: userId,
      status: 'completed'
    });

    // Get count of outstanding payments
    const outstandingPayments = await Payment.countDocuments({
      user: userId,
      status: 'pending'
    });

    return res.status(200).json({
      user,
      stats: {
        groupsJoined,
        completedPayments,
        outstandingPayments
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
