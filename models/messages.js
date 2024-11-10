const mongoose = require('mongoose')

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