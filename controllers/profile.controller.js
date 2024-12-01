// profile.controller.js
const User = require('../models/users'); // Assuming you have a User mo

// Endpoint to upload a profile image
const { cloudinary } = require('../cloudConfig');

module.exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.profileImage && user.profileImage.filename) {
            try {
                // Delete the old image from Cloudinary
                await cloudinary.uploader.destroy(user.profileImage.filename);
            } catch (error) {
                console.error('Error deleting old cover image:', error.message);
            }
        }

        // Save the image information to the user's profile
        user.profileImage = {
            url: req.file.path, // Provided by multer-storage-cloudinary
            filename: req.file.filename,
        };

        await user.save();

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImage: user.profileImage.url,
        });
    } catch (error) {
        console.error('Error uploading profile image:', error.message);
        res.status(500).json({ error: 'Error uploading profile image', details: error.message });
    }
};

module.exports.uploadCoverImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user already has a cover image
        if (user.coverImage && user.coverImage.filename) {
            try {
                // Delete the old image from Cloudinary
                await cloudinary.uploader.destroy(user.coverImage.filename);
            } catch (error) {
                console.error('Error deleting old cover image:', error.message);
            }
        }

        // Save the new image information to the user's profile
        user.coverImage = {
            url: req.file.path, // Provided by multer-storage-cloudinary
            filename: req.file.filename,
        };

        await user.save();

        res.status(200).json({
            message: 'Cover image updated successfully',
            coverImage: user.coverImage.url,
        });
    } catch (error) {
        console.error('Error updating cover image:', error.message);
        res.status(500).json({ error: 'Error updating cover image', details: error.message });
    }
};


