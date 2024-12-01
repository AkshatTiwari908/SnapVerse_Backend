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
		},
		coverImage: {
			url: {
				type: String, // URL to the image file (could be a link from Cloudinary or your server)
				default: 'https://res.cloudinary.com/dl10fq0cu/image/upload/c_fill,g_auto,h_250,w_970/b_rgb:000000,e_gradient_fade,y_-0.50/c_scale,co_rgb:ffffff,fl_relative,l_text:montserrat_25_style_light_align_center:Shop%20Now,w_0.5,y_0.18/v1732961513/tvnz1k3ogooffsrzf54j.jpg' // You can set a default image URL here if required
			},
			filename: {
				type: String, // The filename of the image uploaded
			}
			
		  },
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;









