// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/middleware.js'); 
const notificationController = require('../controllers/notification.js');

router.get('/:userId',verifyToken, notificationController.getNotifications); // Fetch notifications
router.post('/mark-as-read',verifyToken, notificationController.markAsRead); // Mark notifications as read

module.exports = router;
