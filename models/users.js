const mongoose = require('mongoose')
require('dotenv').config();
const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(() => console.log("Connected to User MongoDB"))
  .catch(err => console.error("Failed to connect to Users MongoDB", err));

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
		name: {
			type: String,
			required: true,
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




