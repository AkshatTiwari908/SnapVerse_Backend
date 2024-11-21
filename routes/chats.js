//  /api/messages
const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/middleware.js'); 
const oneToOnechatRouteController = require('../controllers/o-ochatRoutesController')

// Chat history retreival
router.get('/chatHistory',verifyToken,oneToOnechatRouteController.chatHistory ); // Tested Fine
router.post('/send',verifyToken,oneToOnechatRouteController.sendMessage)//Tested Fine
router.put('/markAsRead',verifyToken,oneToOnechatRouteController.markAsRead)// Tested Fine 

// GET user inbox with recent conversations
router.get('/inbox',verifyToken ,oneToOnechatRouteController.openInbox ); // Tested Fine


module.exports = router