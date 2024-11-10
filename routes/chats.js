//  /api/messages
const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
const User = require('../models/users')
const Message = require('../models/messages')

// Chat history retreival
/* router.get('/:senderId/:receiverId', async(req,res)=>{
   const {senderId,receiverId} = req.params
   try {
    const messages = await Message.find(
        {
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        }
    ).sort({ timeStamp: 1 }); // oldest first
    res.status(200).json(messages);
   } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' })
      console.error(error)
   }
}) */

   router.get('/:senderId/:receiverId', async (req, res) => {
    let { senderId, receiverId } = req.params;
    senderId = new  mongoose.Types.ObjectId(senderId.trim());
    receiverId = new mongoose.Types.ObjectId(receiverId.trim());
    console.log("Querying messages for senderId:", senderId, "and receiverId:", receiverId);  // Debug log
  
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId }
        ]
      }).sort({ timeStamp: 1 });  // oldest first
  
      console.log("Messages found:", messages);  // Debug log to inspect the result
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch messages' });
      console.error(error);
    }
  });
  
router.post('/send',async(req,res)=>{
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
})

router.put('/markAsRead',async(req,res)=>{
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
})

module.exports = router