const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const Messenger = require('./routes/chats');
const oneToOnesocket = require('./sockets/o-oSocket');
const dotenv = require('dotenv');
const connectDb = require('./db/connectDb.js');
const authRoutes = require('./routes/auth.route.js');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static('public'));  

// Routes
app.use('/posts', postRoutes);  
app.use('/posts', commentRoutes);  
app.use('/api/messages', Messenger);  
app.use('/api/auth', authRoutes);  

// Socket.IO Setup
oneToOnesocket(io);  


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDb();  
  console.log(`Server is running on port ${PORT}`);
});
