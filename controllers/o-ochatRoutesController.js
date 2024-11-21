const User = require('../models/users')
const Message = require('../models/messages')

module.exports.openInbox = async (req, res) => {  //Tested Fine
  const userId = req.userId;

  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: 'Username is incorrect' });
    }

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
        $sort: { timeStamp: -1 } // Sort messages by timestamp in descending order
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
        $sort: { timeStamp: -1 } // Sort conversations by the latest message timestamp
      }
    ]);

    res.status(200).json(inbox);

  } catch (error) {
    console.error("Error fetching inbox:", error);
    res.status(500).json({ message: "Failed to fetch inbox" });
  }
}

module.exports.chatHistory = async (req, res) => {
    
  const { senderId, receiverId } = req.body;  

  // Ensure that the userId is either sender or receiver (validation can be added)
  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },  // sender sends to receiver
        { sender: receiverId, receiver: senderId }   // receiver sends to sender
      ]
    }).sort({ timeStamp: 1 });  // Sorting by timestamp to get the messages in chronological order

    // Respond with the messages
    res.status(200).json(messages);

  } catch (error) {
    // Error handling
    res.status(500).json({ message: 'Failed to fetch messages' });
    console.error(error);
  }
};

  
  module.exports.sendMessage = async(req,res)=>{  //Tested Fine
    const {receiverUsername,messageContent}=req.body
    const senderId = req.userId;
     
    try {
       const sender = await User.findById(senderId)
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
module.exports.markAsRead = async (req, res) => { // Tested Fine
  const { senderUsername } = req.body;
  const opener = req.userId;

  try {
      const user = await User.findById(opener);
      const sender = await User.findOne({ userName: senderUsername });

      if (!sender) {
          return res.status(404).json({ message: 'Sender not found' });
      }
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const result = await Message.updateMany(
          { sender: sender._id, receiver: user._id, readStatus: false },
          { readStatus: true }
      );
      if (result.matchedCount === 0) {
          return res.status(200).json({ message: 'No unread messages to mark as read' });
      }
      console.log('Update Result:', result);
      res.status(200).json({ message: 'Messages marked as read' });

  } catch (error) {
      console.error('Error updating messages:', error);
      res.status(500).json({ message: 'Failed to update messages' });
  }
};
 