const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userProfileController');
const upload = require('../middleware/upload');
const { uploadProfilePicture } = require('../controllers/userProfileController');

router.get('/:id', getUserProfile);
router.put('/:id/profile-picture', upload.single('image'), uploadProfilePicture);

module.exports = router;
