const {Post,Like,Comment} = require('../models/post');
const User = require('../models/users');
const Follow = require('../models/follow.js');
const multer = require('multer');
const sharp = require('sharp'); // Ensure sharp is installed and imported
const followingsFollowersControllers = require('../controllers/arrayFollowErsIngsControllers.js')
module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name profileImage') // Include name and profile picture of the post author
            .sort({ timestamp: -1 });

        // Enhance posts with like and comment counts
        const postsWithCounts = await Promise.all(
            posts.map(async (post) => {
                const likesCount = await Like.countDocuments({ post: post._id });
                const commentsCount = await Comment.countDocuments({ post: post._id });
                return {
                    ...post.toObject(),
                    likesCount,
                    commentsCount,
                };
            })
        );

        res.status(200).json({ posts: postsWithCounts });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching posts');
    }
};




const cloudinary = require('cloudinary').v2;

module.exports.createPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const userId = req.userId ; // Retrieved from the authenticateToken middleware

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let image = null;

        // Handle image upload to Cloudinary
        if (req.file) {
            try {
                // Upload image to Cloudinary with transformations
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    width: 800,
                    height: 800,
                    crop: 'fit', // Resizes the image to fit within 800x800 while maintaining aspect ratio
                });

                // Store the Cloudinary URL and filename
                image = {
                    url: uploadResponse.secure_url,
                    filename: uploadResponse.public_id,
                };
            } catch (imageError) {
                console.error('Error uploading image:', imageError);
                return res.status(500).json({ error: 'Error uploading image' });
            }
        }

        // Create and save the post
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

module.exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId; // Retrieved from the authenticateToken middleware

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existingLike = await Like.findOne({ post: postId, user: userId });

        if (existingLike) {
            // Unlike the post
            await Like.findByIdAndDelete(existingLike._id);
            post.likesCount -= 1; // Decrement likesCount
        } else {
            // Like the post
            const like = new Like({ post: postId, user: userId });
            await like.save();
            post.likesCount += 1; // Increment likesCount
        }

        await post.save(); // Save the updated likesCount

        res.status(200).json({
            message: existingLike ? 'Post unliked' : 'Post liked',
            likesCount: post.likesCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error toggling like on post' });
    }
};

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

        // Delete the post and related likes and comments
        await Post.findByIdAndDelete(postId);
        await Like.deleteMany({ post: postId });
        await Comment.deleteMany({ post: postId });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting post' });
    }
};



exports.getFollowingPosts = async (req, res) => {
    try {
        const userId = req.userId;
        const following = await followingsFollowersControllers.followingArray(userId);

        const followingIds = following.map(follow => follow.receiverId);

        const posts = await Post.find({ user: { $in: followingIds } })
            .populate('user', 'name profileImage') // Include name and profile picture of the post author
            .sort({ timestamp: -1 });

        // Enhance posts with like and comment counts
        const postsWithCounts = await Promise.all(
            posts.map(async (post) => {
                const likesCount = await Like.countDocuments({ post: post._id });
                const commentsCount = await Comment.countDocuments({ post: post._id });
                return {
                    ...post.toObject(),
                    likesCount,
                    commentsCount,
                };
            })
        );

        res.status(200).json({ posts: postsWithCounts });
    } catch (err) {
        console.error('Error fetching following posts:', err);
        res.status(500).send('Error fetching posts');
    }
};
