const oneToOneSocControllers = require('../controllers/o-oChatSocketsController');
const jwt = require('jsonwebtoken'); 


module.exports = (io) => {
  
    io.on('connection', (socket) => {
        console.log(`New User Connected ${socket.id}`);

        socket.on('join', (data) => oneToOneSocControllers.join(data, io, socket));
        socket.on('sendMessage', (data) => oneToOneSocControllers.sendMessage(data, io));
        socket.on('markAsRead', (data) => oneToOneSocControllers.markAsRead(data));
        socket.on('disconnect', () => oneToOneSocControllers.disconnect(socket));
    });
};



 