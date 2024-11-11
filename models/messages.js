const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    sender:{type:String,required :true,},
    receiver:{type:String,required :true,},
    messageContent:{type:String,required :true,},
    timeStamp :{type: Date, default: Date.now},
    delivered: { type: Boolean, default: false },
    readStatus:{type:Boolean, default:false}
})
const Message = mongoose.model('Message', messageSchema);
module.exports= Message 