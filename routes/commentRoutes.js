const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Add a new comment to a post
router.post('/:postId/comments', commentController.addComment);

// Delete a comment from a post
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

module.exports = router;
