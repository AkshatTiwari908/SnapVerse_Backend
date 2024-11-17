const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const cookieParser = require('cookie-parser'); 
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const profileimage = require('./routes/profileimage.js')
const Messenger = require('./routes/chats');
const searcher = require('./routes/searchRoutes.js')
const myProfileRouter = require('./routes/myProfileRoute.js')
const homePage = require('./routes/homeRoute.js')
const oneToOnesocket = require('./sockets/o-oSocket');
const dotenv = require('dotenv');
const connectDb = require('./db/connectDb.js');
const authRoutes = require('./routes/auth.route.js');
const follow = require('./routes/follow');
const cors = require('cors');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set("view engine","ejs");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname,'clientTesting')));  
app.use('/public', express.static('public'));
app.use(cookieParser());  

// Routes
app.use('/posts', postRoutes);  
app.use('/posts', commentRoutes);  
app.use('/api/messages', Messenger);  
app.use('/api/auth', authRoutes); 
app.use('/api/search',searcher); 
app.use('/api/user',myProfileRouter);
app.use('/home',homePage)
app.use('/',follow)   // issue here wrong routing this could damage other api routes access
app.use('/',profileimage)
// Socket.IO Setup
oneToOnesocket(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  connectDb();  
  console.log(`Server is running on port ${PORT}`);
});