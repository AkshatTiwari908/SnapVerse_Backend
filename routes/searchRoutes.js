const express = require('express')
const searchUFF = require('../controllers/searchUFFController')
const router = express.Router()

router.get('/global',searchUFF.searchGlobal)
router.get('/myFollowers',searchUFF.searchMyFollowers)

module.exports = router