const Post = require('../models/post');

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
        const { caption,user } = req.body;
        const image = req.file
            ? {
                  url: req.file.path,
                  filename: req.file.filename,
              }
            : null;

        const post = new Post({
            user,
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
        const { user } = req.body;  // Now using user from req.body

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(user);
        if (hasLiked) {
            // Remove the user's like
            post.likes = post.likes.filter(id => id.toString() !== user.toString());
        } else {
            // Add the user's like
            post.likes.push(user);
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
