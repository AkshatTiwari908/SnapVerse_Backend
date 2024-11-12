const Post = require('../models/post.js'); // Import your Post model
const User = require('../models/users.js'); // Import your User model

module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text, username } = req.body;  // Now using username instead of user ID

        // Find the user by username
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            user: user._id,  // Use the user ID from the found user
            text,
            timestamp: new Date(),
        };

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
        const { username } = req.body;  // Now using username instead of user ID

        // Find the user by username
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the logged-in user is the author of the comment
        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        post.comments.pull(commentId);
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting comment' });
    }
};

