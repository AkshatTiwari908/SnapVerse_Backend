const express = require("express");
const { Server } = require("socket.io");

const http = require("http");
const Messenger = require("./routes/chats");
const oneToOnesocket = require("./sockets/o-oSocket");
const dotenv = require("dotenv");
const  connectDb  = require("./db/connectDb.js");
const authRoutes = require("./routes/auth.route.js");
dotenv.config();

const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());
app.use("/api/messages", Messenger);
app.use("/api/auth", authRoutes);

oneToOnesocket(io);
app.use(express.json());
const Port = process.env.PORT || 3000;
app.listen(3000, () => {
  connectDb();
  console.log("Server is running on port: ", Port);
});
