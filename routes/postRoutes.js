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
// Fetch all posts (no authentication needed for this endpoint)
router.get('/', postController.getPosts);

// Create a new post (authentication required)
router.post('/', authenticateToken, upload.single('image'), postController.createPost);

// Toggle like on a post (authentication required)
router.post('/:postId/like', authenticateToken, postController.toggleLike);
// Delete a post (authentication required)
router.delete('/:postId', authenticateToken, postController.deletePost);
router.get('/following',authenticateToken,postController.getFollowingPosts);


module.exports = router;

