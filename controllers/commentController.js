const { Post, Comment } = require('../models/post.js'); // Import Post and Comment models
const User = require('../models/users.js'); // Import User model

// Add a new comment to a post
module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;  // The text content of the comment
        const userId = req.userId;  // Get user ID from the token

        // Find the user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the post by postId
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create the new comment object and save it to the Comment collection
        const newComment = new Comment({
            user: user._id,  // The user who made the comment
            post: post._id,  // Reference to the post the comment belongs to
            text,
            timestamp: new Date(),
        });

        await newComment.save();

        // Update the post's commentsCount and save the post
        post.commentsCount += 1;
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding comment' });
    }
};

// Delete a comment from a post
module.exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const userId = req.userId;  // Get user ID from the token

        // Find the post by postId
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Find the comment by commentId in the Comment collection
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the logged-in user is the author of the comment
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        // Remove the comment from the Comment collection
        await Comment.findByIdAndDelete(commentId);

        // Update the post's commentsCount and save the post
        post.commentsCount -= 1;
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
};
