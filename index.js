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
const corsOptions = {
  origin: 'http://localhost:5173',  // Your frontend running locally on localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  credentials: true,  // Allow cookies to be sent with requests (if necessary)
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname,'clientTesting')));  
app.use('/public', express.static('public'));
app.use(cookieParser());  

// Routes
app.use('/posts', postRoutes);  
app.use('/posts', commentRoutes);  
app.use('/api/messages', Messenger);  
app.use('/api/auth', authRoutes); 
app.use('/api/search',searcher); 
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