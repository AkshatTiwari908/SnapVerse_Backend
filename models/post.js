const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});
const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  
    image: { url : String,
        filename: String,
    },  
    caption: { type: String, maxlength: 500 }, 
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
    comments: [commentSchema],  
    timestamp: { type: Date, default: Date.now }  
});


const Post = mongoose.model('Post', postSchema);

module.exports = Post;
