const express = require('express')
const {Server} = require('socket.io')
const User = require('./models/users')
const Message = require('./models/messages')
const http = require('http')

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.json)

io.on('connection',(socket)=>{
   
    console.log(`New User Connected &{socket.id}`)
   
    socket.on('join',async({userId})=>{
        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { online: true, socketId: socket.id },
                { new: true }
            );
            if (user) {
                console.log(`User ${userId} joined with socket ID ${socket.id}`);
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error joining user:', error);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, messageContent }) => {
        try {
            // Save message to DB
            const message = await Message.create({
                sender: senderId,
                receiver: receiverId,
                messageContent
            });

            const receiver = await User.findById(receiverId);

            if (receiver && receiver.online && receiver.socketId) {
                // Emit message to receiver if online
                io.to(receiver.socketId).emit('receiveMessage', {
                    messageContent,
                    senderId,
                    timestamp: message.timestamp
                });
                console.log(`Message sent from ${senderId} to ${receiverId}`);
            } else {
                console.log(`User ${receiverId} is offline; message stored in DB`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
   
    // 3. Receiving messages (Client-side event to mark messages as read)
    socket.on('markAsRead', async ({ userId, senderId }) => {
        try {
            // Update all unread messages from sender to receiver as read
            await Message.updateMany(
                { sender: senderId, receiver: userId, readStatus: false },
                { readStatus: true }
            );
            console.log(`Messages from ${senderId} to ${userId} marked as read`);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });
    
    socket.on('disconnect', async () => {
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
    });
        
})

server.listen(3000,()=>{
    console.log('Listening>>>>>>port 3000')
})