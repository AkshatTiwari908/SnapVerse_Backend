const User = require('../models/users.js');
const Follow = require('../models/follow.js');

exports.sendFollowRequest = async (req, res) => {
  try {
    const senderId = req.userId; 
    const receiverUsername = req.params.receiverUsername; 
   
    
    const receiver = await User.findOne({ userName: receiverUsername });
   
    const receiverId = receiver._id;


    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }
    const existingFollow = await Follow.findOne({
        requesterId: senderId,
        receiverId: receiverId
      });
      if (existingFollow) {
        return res.status(400).json({ message: "You are already following this user!" });
      }
 
    await Follow.create({ requesterId: senderId, receiverId });

     await User.findByIdAndUpdate(senderId, { $inc: { followingCount: 1 } });

     await User.findByIdAndUpdate(receiverId, { $inc: { followersCount: 1 } });

    res.status(201).json({ message: "Follow request sent!" });
  } catch (error) {
    console.error("Error sending follow request:", error);
    res.status(500).json({ message: "Error sending follow request", error });
  }
};

exports.unfollowUser = async (req, res) => {
    try {
      const senderId = req.userId; 
      const receiverUsername = req.params.receiverUsername; 
  
      const receiver = await User.findOne({ userName: receiverUsername });
      const receiverId = receiver._id;
  
      
      const followRelationship = await Follow.findOneAndDelete({
        requesterId: senderId,
        receiverId: receiverId
      });
  
      if (!followRelationship) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
  
      
      await User.findByIdAndUpdate(senderId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(receiverId, { $inc: { followersCount: -1 } });
  
      res.status(200).json({ message: "Successfully unfollowed!" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: "Error unfollowing user", error });
    }
  };
const getFollowers = async (userId) => {
    try {
      const followers = await Follow.find({
        receiverId: userId,
        status: 'requested'
      }).populate('requesterId', 'userName'); // Populate to get the username of the follower
  
      return followers.map(follow => follow.requesterId); 
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw new Error("Error fetching followers");
    }
  };

  const getFollowing = async (userId) => {
    try {
      const following = await Follow.find({
        requesterId: userId,
        status: 'requested'
      }).populate('receiverId', 'userName'); 
  
      return following.map(follow => follow.receiverId);
    } catch (error) {
      console.error("Error fetching following:", error);
      throw new Error("Error fetching following");
    }
  };

  exports.getFollowerLists = async (req, res) => {
  try {
    const userId = req.userId; 
    
    const followers = await getFollowers(userId);
   

    res.status(200).json({
      followers: followers,
      
    });
  } catch (error) {
    console.error("Error fetching follow lists:", error);
    res.status(500).json({ message: "Error fetching follow lists", error });
  }
};
exports.getFollowingLists = async (req, res) => {
    try {
      const userId = req.userId; 
      
      
      const following = await getFollowing(userId);
  
      res.status(200).json({
        
        following: following
      });
    } catch (error) {
      console.error("Error fetching follow lists:", error);
      res.status(500).json({ message: "Error fetching follow lists", error });
    }
  };