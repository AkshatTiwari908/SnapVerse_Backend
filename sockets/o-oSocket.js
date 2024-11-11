const oneToOneSocControllers = require('../controllers/o-oChatSocketsController')
  module.exports = (io)=>{
    io.on('connection',(socket)=>{
   
        console.log(`New User Connected ${socket.id}`)
        
        socket.on('join', oneToOneSocControllers.join);
        socket.on('sendMessage', oneToOneSocControllers.sendMessage);
        socket.on('markAsRead', oneToOneSocControllers.markAsRead);
        socket.on('disconnect', oneToOneSocControllers.disconnect);
            
    })
  } 




 