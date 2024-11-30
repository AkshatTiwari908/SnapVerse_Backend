const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/middleware.js'); 
const homePageControllers = require('../controllers/homePageController.js')
router.get('/:id',homePageControllers.getUserProfile)
module.exports = router