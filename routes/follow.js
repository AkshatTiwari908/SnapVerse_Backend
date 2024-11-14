
const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const verifyToken = require('../middleware/middleware.js'); 

router.delete('/follow/unfollow/:receiverUsername', verifyToken, followController.unfollowUser);
router.post('/follow/:receiverUsername', verifyToken, followController.sendFollowRequest);
router.get('/follow/lists', verifyToken, followController.getFollowerLists);
router.get('/follow/lists', verifyToken, followController.getFollowingLists);

module.exports = router;
