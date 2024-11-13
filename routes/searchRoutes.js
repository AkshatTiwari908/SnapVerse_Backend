const express = require('express')
const searchUFF = require('../controllers/searchUFFController')
router = express.Router()

router.get('/global',searchUFF.searchGlobal)
module.exports=router