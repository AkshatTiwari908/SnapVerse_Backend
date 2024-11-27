const User = require('../models/users.js');
const {Post} = require('../models/post.js')
const mongoose = require('mongoose')
const followingsFollowersControllers = require('../controllers/arrayFollowErsIngsControllers.js')
module.exports.getLoggedInUser = async (req,res)=>{
    const userId =  req.userId 
   try {
       const user = await User.findById(userId);
       const posts = await Post.find({ user: userId }).populate('user', 'name email').populate('likes', 'name email').populate('comments.user', 'name email'); 
       if (!user) {
           return res.status(404).json({ error: 'User not found' });
       }
       res.status(200).json({
        user:user,
        posts:posts 
      });
   } catch (error) {
       res.status(500).json({error:'failed to fetch user data'})
   }
  }

  module.exports.getUsersPeople = async(req,res)=>{
    try {
        const userId = req.userId; 
        const followings = await followingsFollowersControllers.followingArray(userId)
        const followers = await followingsFollowersControllers.followersArray(userId)
        // Filtering
        const onlineFollowings = followings.filter(following => following.isOnline === true);
        const onlineFollowers = followers.filter(follower => follower.isOnline === true);
        const AllFollowings = followings
        const AllFollowers = followers
        res.status(200).json({
          onlineFollowings,
          onlineFollowers,
          AllFollowings,
          AllFollowers
        });
    
      } catch (error) {
        console.error('Error fetching followings and followers:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
      }
  }
  module.exports.getUserProfile = async (req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.params.id);
    try {
      const user = await User.findById(userId);
      const posts = await Post.find({ user: userId });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({
       user:user,
       posts:posts
     });
  } catch (error) {
      res.status(500).json({error:'failed to fetch user data'})
  }
}
