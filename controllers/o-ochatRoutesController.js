const User = require('../models/users')
const Message = require('../models/messages')
const mongoose = require('mongoose')

module.exports.openInbox = async (req, res) => {
    let { userId } = req.body;
        // There is problem in this API how the frontend will dereference objecId of sender and reciever
        
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }
    userId = new  mongoose.Types.ObjectId(userId.trim());
   
    try {
      const inbox = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: userId },
              { receiver: userId }
            ]
          }
        },
        {
          $sort: { timeStamp: -1 } // Sort messages by timeStamp in descending order
        },
        {
          $group: {
            _id: {
              conversationWith: { 
                $cond: { if: { $eq: ["$sender", userId] }, then: "$receiver", else: "$sender" }
              }
            },
            latestMessage: { $first: "$$ROOT" } // Get the latest message in each conversation
          }
        },
        {
          $replaceRoot: { newRoot: "$latestMessage" }
        },
        {
          $sort: { timeStamp: -1 } // Sort conversations by latest message timestamp
        }
      ]);
  
      res.status(200).json(inbox);
  
    } catch (error) {
      console.error("Error fetching inbox:", error);
      res.status(500).json({ message: "Failed to fetch inbox" });
    }
  }
   
 module.exports.chatHistory = async (req, res) => {
    let { senderId, receiverId } = req.params;
    senderId = new  mongoose.Types.ObjectId(senderId.trim());
    receiverId = new mongoose.Types.ObjectId(receiverId.trim());
  
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      }).sort({ timeStamp: 1 });  // oldest first
      res.status(200).json(messages);

    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
      console.error(error);
    }
  }
  
  module.exports.sendMessage = async(req,res)=>{
    const {senderId,receiverId,messageContent}=req.body
    try {
       const message = await Message.create(
       {
           sender: senderId,
           receiver: receiverId,
           messageContent
       })
       res.status(201).json({message:'Message sent',message})
    } catch (error) {
       res.status(500).json({ message: 'Failed to send message' })
    }
}
module.exports.markAsRead = async(req,res)=>{
    const {userId,senderId} = req.body
    try {
      
          await Message.updateMany(
              { sender: senderId, receiver: userId, readStatus: false },
              { readStatus: true }
          )
          res.status(200).json({ message: 'Messages marked as read' })
      
    } catch (error) {
          res.status(500).json({ message: 'Failed to update messages' }) 
    }
  }