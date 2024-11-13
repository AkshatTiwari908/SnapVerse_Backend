const User = require('../models/users.js');
const Follow = require('../models/follow.js');

exports.sendFollowRequest = async (req, res) => {
  try {
    const senderId = req.user.userId; // Get senderId from JWT (assuming middleware attaches user data to req)
    const receiverUsername = req.params.receiverUsername; // Extract receiver's username from route params

    
    const receiver = await User.findOne({ username: receiverUsername });

    const receiverId = receiver._id;
    console.log(receiverId);

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself!" });
    }

    
    await Follow.create({ requesterId: senderId, receiverId });
    res.status(201).json({ message: "Follow request sent!" });
  } catch (error) {
    console.error("Error sending follow request:", error);
    res.status(500).json({ message: "Error sending follow request", error });
  }
};
