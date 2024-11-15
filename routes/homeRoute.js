const express = require('express')
const router = express.Router()

const Follow = require('../models/follow.js')
const mongoose = require('mongoose')
const verifyToken = require('../middleware/middleware.js'); 

const homePageControllers = require('../controllers/homePageController.js')

router.get('/',verifyToken , async (req, res) => {
    try {
        const userId = req.userId; //User Id coming from JWT and token bearer
       const postsResponse = await homePageControllers.fetchPosts(); // This calls the existing posts API

        // Fetch online users
        const onlineUsersResponse = await homePageControllers.fetchOnlineUsers(); // This will calls the existing online users API

        // Fetch current user's profile data
        const userProfileResponse = await homePageControllers.fetchUserProfile(userId); // This calls the existing user profile API
        const responseData = {
            posts: postsResponse, 
            onlineUsers: onlineUsersResponse, // Array of online users
            userProfile: userProfileResponse, // Current user's profile data
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error loading homepage data", error);
        res.status(500).json({ message: 'Failed to load homepage data' });
    }
});

router.get('/online-users',async(req,res)=>{
    try {
        const userId = req.userId; 
        const followings = await Follow.aggregate([
          {
            $match: { requesterId:new mongoose.Types.ObjectId(userId), status: 'requested' }
          },
          {
            $lookup: {
              from: 'users',  
              localField: 'receiverId',
              foreignField: '_id',
              as: 'receiverInfo'
            }
          },
          { $unwind: '$receiverInfo' },
          {
            $project: {
              _id: 0,
              receiverId: '$receiverId',
              userName: '$receiverInfo.userName',
              isOnline: '$receiverInfo.isOnline'
            }
          }
        ]);

        const followers = await Follow.aggregate([
          {
            $match: { receiverId:new mongoose.Types.ObjectId(userId), status: 'requested' }
          },
          {
            $lookup: {
              from: 'users',  
              localField: 'requesterId',
              foreignField: '_id',
              as: 'requesterInfo'
            }
          },
          { $unwind: '$requesterInfo' },
          {
            $project: {
              _id: 0,
              requesterId: '$requesterId',
              userName: '$requesterInfo.userName',
              isOnline: '$requesterInfo.isOnline'
            }
          }
        ]);
    
        // Filtering
        const onlineFollowings = followings.filter(following => following.isOnline === true);
        const onlineFollowers = followers.filter(follower => follower.isOnline === true);

        res.status(200).json({
          onlineFollowings,
          onlineFollowers
        });
    
      } catch (error) {
        console.error('Error fetching followings and followers:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
      }
}
)

module.exports = router