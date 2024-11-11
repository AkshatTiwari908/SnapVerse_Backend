const express =  require("express");

const {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth
	
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
 router.post("/forgot-password", forgotPassword);
 router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", checkAuth);
module.exports= router;