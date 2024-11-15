const User = require('../models/users')
const Message = require('../models/messages')
const mongoose = require('mongoose')

module.exports.openInbox = async (req, res) => {
    let { username } = req.params;
        // There is problem in this API how the frontend will dereference objecId of sender and reciever
      const user = User.findOne({ userName: username })
    if (!user) {
      return res.status(400).json({ message: 'username Is incorrect' });
    }
   
    try {
      const inbox = await Message.aggregate([
        {
          $match: {
            $or: [
              { sender: user._id },
              { receiver: user._id }
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
                $cond: { if: { $eq: ["$sender", user._id] }, then: "$receiver", else: "$sender" }
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
    let { senderUsername, receiverUsername} = req.params;
    sender = await User.findOne({ userName: senderUsername })
    receiver = await User.findOne({ userName: receiverUsername })
  
    try {
      const messages = await Message.find({
        $or: [
          { sender: sender._id, receiver: receiver._id },
          { sender: receiver._id, receiver: sender._id }
        ]
      }).sort({ timeStamp: 1 });  // oldest first
      res.status(200).json(messages);

    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
      console.error(error);
    }
  }
  
  module.exports.sendMessage = async(req,res)=>{
    const {senderUsername,receiverUsername,messageContent}=req.body
     
    try {
       const sender = await User.findOne({ userName: senderUsername })
       const receiver = await User.findOne({ userName: receiverUsername })
       const message = await Message.create(
       {
           sender: sender._id,
           receiver: receiver._id,
           messageContent
       })
       res.status(201).json({message:'Message sent',message})
    } catch (error) {
       res.status(500).json({ message: 'Failed to send message' })
    }
}
module.exports.markAsRead = async(req,res)=>{
    const {userUsername,senderUsername} = req.body
       const user = await User.findOne({ userName:userUsername  })
       const sender = await User.findOne({ userName: senderUsername })
    try {
      
          await Message.updateMany(
              { sender: sender._id, receiver: user._id, readStatus: false },
              { readStatus: true }
          )
          res.status(200).json({ message: 'Messages marked as read' })
      
    } catch (error) {
          res.status(500).json({ message: 'Failed to update messages' }) 
    }
  }