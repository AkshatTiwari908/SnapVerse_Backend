const mongoose = require('mongoose');

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
		userName: {
			type: String,
			required: true,
			unique: true,
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
		followersCount: {
			type: Number,
			default: 0
		},
		followingCount: {
			type: Number,
			default: 0
		},
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,
		// Profile image section
		profileImage: {
			url: {
				type: String, // URL to the image file (could be a link from Cloudinary or your server)
				default: 'https://res.cloudinary.com/dl10fq0cu/image/upload/v1731652645/00000000000000000000000000000000_wrtw74.jpg' // You can set a default image URL here if required
			},
			filename: {
				type: String, // The filename of the image uploaded
			}
		}
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;









