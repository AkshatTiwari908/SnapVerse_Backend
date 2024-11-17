const { uploadProfileImage, uploadCoverImage} = require('../controllers/profile.controller');
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const authenticateToken = require('../middleware/middleware.js'); 

// Route for uploading profile image
router.post('/upload-profile-image',authenticateToken, upload.single('image'), uploadProfileImage);
router.post('/upload-cover-image',authenticateToken, upload.single('cover'),uploadCoverImage );

module.exports = router;
