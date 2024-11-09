import express from "express";
import {
	login,
	logout,
	signup,
	verifyEmail,
	forgotPassword,
	resetPassword,
	checkAuth
	
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
 router.post("/forgot-password", forgotPassword);
 router.post("/reset-password", resetPassword);
router.get("/check-auth", checkAuth);
export default router;