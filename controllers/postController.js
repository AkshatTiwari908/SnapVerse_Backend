const Post = require('../models/post');
const User = require('../models/users');
const Follow = require('../models/follow.js');
const followingsFollowersControllers = require('../controllers/arrayFollowErsIngsControllers.js')
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
        const { caption } = req.body;
        const userId = req.userId; // Retrieved from the authenticateToken middleware

        // Check if the user exists
        const user = await User.findById(userId);
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
            user: user._id,
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
        const userId = req.userId; // Retrieved from the authenticateToken middleware

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // Remove the user's like
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            // Add the user's like
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

// Delete a post
module.exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId; // Retrieved from the authenticateToken middleware

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the post belongs to the user
        if (post.user.toString() !== userId) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await Post.findByIdAndDelete(postId);

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting post' });
    }
};


exports.getFollowingPosts = async (req, res) => {
  try {
    const userId = req.userId; 
    const following = await followingsFollowersControllers.followingArray(userId)

    const followingIds = following.map(follow => follow.receiverId);

    const posts = await Post.find({ user: { $in: followingIds } }) // Filter posts
      .populate('user', 'name') // Populate user details (e.g., name)
      .populate('comments.user', 'name') // Populate commenter details
      .sort({ timestamp: -1 }); // Sort by timestamp, latest first

    res.status(200).json({ posts });
  } catch (err) {
    console.error("Error fetching following posts:", err);
    res.status(500).send('Error fetching posts');
  }
};
