const User = require('../models/users')

module.exports.searchGlobal =async(req,res)=>{
    try{
    const query = req.query.q
    if(!query){
       return res.status(400).json({error :"Type Something to search"})
    }
    const people = await User.aggregate([
        {
            $match:{
                  $or:[
                    {userName :{ $regex:query,$options:'i'} },
                    {name: {$regex:query,$options:'i'}}
                  ]
            } 
        },
        { $limit: 7 }
    ])
    res.status(200).json(people)
}catch(error){
    res.status(500).json({ error: 'An error occurred while searching' });
}
}