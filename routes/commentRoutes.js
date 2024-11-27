const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticateToken = require('../middleware/middleware.js'); 

// Add a new comment to a post (authentication required)
router.post('/:postId/comments', authenticateToken, commentController.addComment);

// Delete a comment from a post (authentication required)
router.delete('/:postId/comments/:commentId', authenticateToken, commentController.deleteComment);
router.get('/:postId/comments', commentController.getComments);
module.exports = router;
