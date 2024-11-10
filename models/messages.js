const mongoose = require('mongoose')
const User = require('./users.js');
require('dotenv').config();
const uri = process.env.MONGO_URI;
mongoose.connect(
uri).then(() => console.log("Connected to Messages MongoDB"))
  .catch(err => console.error("Failed to connect to Messages MongoDB", err));

const messageSchema = new mongoose.Schema({
    sender:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    messageContent:{type:String,required :true,},
    timeStamp :{type: Date, default: Date.now},
    delivered: { type: Boolean, default: false },
    readStatus:{type:Boolean, default:false}
})
const Message = mongoose.model('Message', messageSchema);
module.exports= Message 