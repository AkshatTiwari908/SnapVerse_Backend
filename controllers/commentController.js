const Post = require('../models/post');

// Add a new comment to a post
// Add a new comment to a post
module.exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const { user } = req.body;  // Make sure user is passed in the body

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            user,           // user will be the ID from req.body
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
// Delete a comment from a post
module.exports.deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const { user } = req.body;  // user passed in the body

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.user.toString() !== user.toString()) {
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

