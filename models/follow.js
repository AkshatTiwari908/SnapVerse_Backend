const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types 
const followSchema = new mongoose.Schema({
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})
const follow = mongoose.model('Follow', followSchema);
module.exports= follow ;