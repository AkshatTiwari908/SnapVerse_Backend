const mongoose = require('mongoose')
const { boolean } = require('webidl-conversions')
require('dotenv').config();
const uri = process.env.MONGO_URI;
mongoose.connect(
uri).then(() => console.log("Connected to Messages MongoDB"))
  .catch(err => console.error("Failed to connect to Messages MongoDB", err));

const messageSchema = new mongoose.Schema({
    sender:{type:String,required :true,},
    receiver:{type:String,required :true,},
    messageContent:{type:String,required :true,},
    timeStamp :{type: Date, default: Date.now},
    readStatus:{type:Boolean, default:false}
})
const Message = mongoose.model('Message', messageSchema);
module.exports= Message