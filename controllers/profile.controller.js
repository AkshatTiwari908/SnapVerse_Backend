// profile.controller.js
const cloudinary = require('../cloudinary-config'); // Cloudinary config file
const User = require('../models/user'); // Assuming you have a User model
// const upload = require('../multer-config'); // Multer config

// Endpoint to upload a profile image
module.exports.uploadProfileImage = async (req, res) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // // Upload image to Cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path);

        // Get user ID from the request (e.g., from JWT token)
        const userId = req.userId; // Assuming you have user authentication

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Save the image URL in the user's profile
        user.profileImage = {
            url: result.secure_url, // Cloudinary image URL
            filename: result.public_id, // Cloudinary public ID for the image
        };

        // Save the updated user profile
        await user.save();

        // Respond with the updated user data
        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImage: result.secure_url, // Return the image URL
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading profile image' });
    }
};
