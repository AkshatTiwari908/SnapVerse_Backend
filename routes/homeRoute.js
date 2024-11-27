const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/middleware.js'); 
const homePageControllers = require('../controllers/homePageController.js')
const postController = require('../controllers/postController');

router.get('/profile',verifyToken ,homePageControllers.getLoggedInUser)
router.get('/available-people',verifyToken,homePageControllers.getUsersPeople)
router.get('/posts',verifyToken,postController.getFollowingPosts);
router.get('/suggested/users',homePageControllers.getSuggestedUsers )
module.exports = router