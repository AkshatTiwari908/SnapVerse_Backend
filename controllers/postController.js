const Post = require('../models/post');

// Fetch all posts
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .populate('comments.user', 'name')
            .sort({ timestamp: -1 });
        res.render('posts', { posts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
};

// Create a new post
module.exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        // if (!req.user || !req.user._id) {
        //     return res.status(400).json({ message: 'User is not authenticated' });
        // }
        const userId= req.user._id;
        const image = req.file
            ? {
                  url: req.file.path,
                  filename: req.file.filename,
              }
            : null;

        const post = new Post({
            user: userId,
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
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const hasLiked = post.likes.includes(userId);
        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        } else {
            post.likes.push(userId);
        }

        await post.save();
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
