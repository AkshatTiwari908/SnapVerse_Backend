const express = require('express')
const {Server} = require('socket.io')

const http = require('http')
const Messenger = require('./routes/chats')
const oneToOnesocket = require('./sockets/o-oSocket')
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json())
app.use(cors());
app.use('/api/messages', Messenger)

oneToOnesocket(io)

server.listen(5000,()=>{
    console.log('Listening>>>>>>port 5000')
})