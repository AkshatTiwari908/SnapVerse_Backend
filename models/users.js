const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		userName:{ 
             type:String,
			 required:true,
			 unique:true
		},
		name: {
			type: String,
			required: true,
			unique: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		socketId: { 
			type: String
		},
	
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
	},
	{ timestamps: true }
);
const User =  mongoose.model("User", userSchema);
module.exports = User 








