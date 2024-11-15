const Post = require('../models/post');
const User = require('../models/users'); // Import your User model
// Fetch all posts
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ timestamp: -1 });
            res.status(200).json({ posts });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
};

// Create a new post


module.exports.createPost = async (req, res) => {
    try {
        const { caption, username } = req.body;

        // Find the user by username
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const image = req.file
            ? {
                  url: req.file.path,
                  filename: req.file.filename,
              }
            : null;

        const post = new Post({
            user: user._id, // Use user ID from found user
            image,
            caption,
            timestamp: new Date(),
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating post' });
    }
};


// Toggle like on a post
module.exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username } = req.body;  // Now using username from req.body

        // Find the user by username
        const user = await User.findOne({ userName: username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const userId = user._id.toString();
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Remove the user's like
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Add the user's like
            post.likes.push(userId);
        }

        // Save the updated post
        await post.save();

        // Send the response with the updated post and likes count
        res.status(200).json({
            message: hasLiked ? 'Post unliked' : 'Post liked',
            likesCount: post.likes.length,
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error toggling like on post' });
    }
};
module.exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting post' });
    }
};
