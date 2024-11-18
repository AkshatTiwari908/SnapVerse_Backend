const Follow = require('../models/follow.js')
const mongoose = require('mongoose')

module.exports.followingArray = async(userId)=>{
   const followings =await Follow.aggregate([
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
      return followings
}

module.exports.followersArray = async(userId)=>{
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
  return followers
}