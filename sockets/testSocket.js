   // TEST VERSION
    // sockets/oneToOneSocket.js
    
    const Message = require('../models/messages');

    module.exports = (io) => {
      io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
    
        // Join room for one-to-one chat
        socket.on('joinRoom', ({ senderId, receiverId }) => {
          const roomName = [senderId, receiverId].sort().join('_');
          socket.join(roomName);
        });
    
        // Handle sending messages
        socket.on('sendMessage', async ({ sender, receiver, messageContent }) => {
          try {
            const message = await Message.create({ sender, receiver, messageContent });
            const roomName = [sender, receiver].sort().join('_');
            io.to(roomName).emit('receiveMessage', message);
          } catch (error) {
            console.error('Error sending message:', error);
          }
        });
    
        socket.on('disconnect', () => {
          console.log('User disconnected:', socket.id);
        });
      });
    };
    