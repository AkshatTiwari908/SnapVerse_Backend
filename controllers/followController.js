const User = require('../models/users.js');
const Follow = require('../models/follow.js');

exports.sendFollowRequest = async (req, res) => {
  try {
    const senderId = req.userId; // Get senderId from JWT (assuming middleware attaches user data to req)
    const receiverUsername = req.params.receiverUsername; // Extract receiver's username from route params
   
    
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
    // Create a new follow request
    await Follow.create({ requesterId: senderId, receiverId });

     // Increment both followersCount and followingCount
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
      const senderId = req.userId; // Get senderId from JWT (middleware attaches user data to req)
      const receiverUsername = req.params.receiverUsername; // Extract receiver's username from route params
  
      const receiver = await User.findOne({ userName: receiverUsername });
      const receiverId = receiver._id;
  
      // Check if the follow relationship exists
      const followRelationship = await Follow.findOneAndDelete({
        requesterId: senderId,
        receiverId: receiverId
      });
  
      if (!followRelationship) {
        return res.status(404).json({ message: "Follow relationship not found" });
      }
  
      // Decrement both followersCount and followingCount
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
      // Find all follow requests where the user is the receiver and the status is 'accepted'
      const followers = await Follow.find({
        receiverId: userId,
        status: 'accepted'
      }).populate('requesterId', 'userName'); // Populate to get the username of the follower
  
      // Return an array of follower users
      return followers.map(follow => follow.requesterId); 
    } catch (error) {
      console.error("Error fetching followers:", error);
      throw new Error("Error fetching followers");
    }
  };

  const getFollowing = async (userId) => {
    try {
      // Find all follow requests where the user is the requester and the status is 'accepted'
      const following = await Follow.find({
        requesterId: userId,
        status: 'accepted'
      }).populate('receiverId', 'userName'); // Populate to get the username of the user being followed
  
      // Return an array of followed users
      return following.map(follow => follow.receiverId);
    } catch (error) {
      console.error("Error fetching following:", error);
      throw new Error("Error fetching following");
    }
  };

  exports.getFollowerLists = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the authenticated user (attached by middleware)
    
    // Fetch followers and following lists using the helper functions
    const followers = await getFollowers(userId);
   

    res.status(200).json({
      followers: followers,
      following: following
    });
  } catch (error) {
    console.error("Error fetching follow lists:", error);
    res.status(500).json({ message: "Error fetching follow lists", error });
  }
};
exports.getFollowingLists = async (req, res) => {
    try {
      const userId = req.userId; // Get userId from the authenticated user (attached by middleware)
      
      // Fetch followers and following lists using the helper functions
      
      const following = await getFollowing(userId);
  
      res.status(200).json({
        followers: followers,
        following: following
      });
    } catch (error) {
      console.error("Error fetching follow lists:", error);
      res.status(500).json({ message: "Error fetching follow lists", error });
    }
  };