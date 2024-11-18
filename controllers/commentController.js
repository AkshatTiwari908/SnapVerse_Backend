const Post = require('../models/post.js'); // Import your Post model
const User = require('../models/users.js'); // Import your User model

// Add a new comment to a post
module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;  // Assuming 'text' is the content of the comment
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

        // Create the new comment object
        const newComment = {
            user: user._id,  // Use the user ID from the found user
            text,
            timestamp: new Date(),
        };

        // Push the comment into the post's comments array
        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });
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

        // Find the comment by commentId in the post's comments
        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the logged-in user is the author of the comment
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        // Pull the comment out of the post's comments array
        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
};

