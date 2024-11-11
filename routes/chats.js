//  /api/messages
const express = require('express')
const mongoose = require("mongoose")
const router = express.Router()
const User = require('../models/users')
const Message = require('../models/messages')
const oneToOnechatRouteController = require('../controllers/o-ochatRoutesController')

// Chat history retreival
router.get('/:senderId/:receiverId',oneToOnechatRouteController.chatHistory );
router.post('/send',oneToOnechatRouteController.sendMessage)
router.put('/markAsRead',oneToOnechatRouteController.markAsRead)

// GETuser inbox with recent conversations
router.get('/inbox', oneToOnechatRouteController.openInbox );


module.exports = router