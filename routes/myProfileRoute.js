const express = require('express')
const router = express.Router()
const User = require('../models/users.js');

router.get('/profile/:id' ,async (req,res)=>{
     const userId =  req.params.id 
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error:'failed to fetch user data'})
    }
})
module.exports= router