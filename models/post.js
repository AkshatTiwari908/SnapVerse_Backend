const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    timestamp: { type: Date, default: Date.now }
});
const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // Link to the Post
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  likesCount: { type: Number, default: 0 }, // Store the count of likes
  commentsCount: { type: Number, default: 0 } ,// Store the count of comments
  image: {
    url: { type: String, required: false }, // URL of the uploaded image
    filename: { type: String, required: false }, // Filename of the uploaded image
  },
});
const Like = mongoose.model('Like', likeSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Post = mongoose.model('Post', postSchema);
module.exports = {Like , Comment , Post};

