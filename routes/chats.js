//  /api/messages
const express = require('express')
const router = express.Router()

const oneToOnechatRouteController = require('../controllers/o-ochatRoutesController')

// Chat history retreival
router.get('/:senderUN/:receiverUN',oneToOnechatRouteController.chatHistory ); // Tested OK
router.post('/send',oneToOnechatRouteController.sendMessage)//Tested OK
router.put('/markAsRead',oneToOnechatRouteController.markAsRead)//Tested OK

// GET user inbox with recent conversations
router.get('/inbox/:user', oneToOnechatRouteController.openInbox ); //Tested OK


module.exports = router