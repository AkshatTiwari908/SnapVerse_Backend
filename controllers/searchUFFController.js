const User = require('../models/users')
const Follow = require('../models/follow')
const listofFollowersFollowings = require('../controllers/arrayFollowErsIngsControllers')

module.exports.searchGlobal = async(req,res)=>{
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

module.exports.searchMyFollowers = async(req,res)=>{
    try {
        const userId = req.userId  // whooseFollowers
        const query = req.query.q  // Searched User
        const followers = await listofFollowersFollowings.followersArray()
       
        let filteredFollowers = followers
        if(query){
            const regex = new RegExp(query, 'i');
            filteredFollowers = followers.filter(follower =>
                regex.test(follower.userName) 
              );
        }

    } catch (error) {
        
    }
       

}