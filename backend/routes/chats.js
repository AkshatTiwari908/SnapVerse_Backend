//  /api/messages
const express = require('express')
const router = express.Router()
const User = require('./backend/models/users')
const Message = require('./backend/models/messages')

// Chat history retreival
router.get('/:senderId/:receiver:Id', async(req,res)=>{
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
})