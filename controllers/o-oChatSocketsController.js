const User = require('../models/users')
const Message = require('../models/messages')

module.exports.join = async({userId})=>{
    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { online: true, socketId: socket.id },
            { new: true }
        );
        if (user) {
            console.log(`User ${userId} joined with socket ID ${socket.id}`);
            const undeliveredMessages = await Message.find({
                receiver: userId,
                delivered: false
            });

            undeliveredMessages.forEach((message) => {
                io.to(socket.id).emit('receiveMessage', {
                    messageContent: message.messageContent,
                    senderId: message.sender,
                    timestamp: message.timestamp
                });

                // Mark as delivered after sending
                message.delivered = true;
                message.save();
            });
        } else {
            console.log('User not found');
        }
    } catch (error) {
        console.error('Error joining user:', error);
    }
}

module.exports.sendMessage =  async ({ senderId, receiverId, messageContent }) => {
    try {
        // Save message to DB
        const message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            messageContent,
            delivered: false,
            timeStamp: new Date() 
        });

        const receiver = await User.findById(receiverId);

        if (receiver && receiver.online && receiver.socketId) {
            // Emit message to receiver if online
            io.to(receiver.socketId).emit('receiveMessage', {
                messageContent,
                senderId,
                timeStamp: message.timeStamp
            });
            await Message.findByIdAndUpdate(message._id, { delivered: true });
            console.log(`Message sent from ${senderId} to ${receiverId}`);
        } else {
            console.log(`User ${receiverId} is offline; message stored in DB`);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
module.exports.markAsRead = async ({ userId, senderId }) => {
    try {
        // Update unread messages from sender to receiver as read
        await Message.updateMany(
            { sender: senderId, receiver: userId, readStatus: false },
            { readStatus: true }
        );
        console.log(`Messages from ${senderId} to ${userId} marked as read`);
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

module.exports.disconnect = async () => {
    try {
        const user = await User.findOneAndUpdate(
            { socketId: socket.id },
            { online: false, socketId: null }
        );
        if (user) {
            console.log(`User ${user._id} disconnected and is offline`);
        } else {
            console.log('User not found during disconnect');
        }
    } catch (error) {
        console.error('Error handling disconnect:', error);
    }
}