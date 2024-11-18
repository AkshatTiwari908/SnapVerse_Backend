module.exports.fetchFollowingPosts = async (userId) => {
    try {
       
        // Fetch posts from /posts/following
        const response = await fetch(`https://snapverse-6nqx.onrender.com/posts/following/${userId}`);

        // If the response is not OK (non-200 status), handle the error
        if (!response.ok) {
            console.error('Failed to fetch posts:', response.status, response.statusText);
            throw new Error(`Failed to fetch posts of ${userId}`);
        }

        const data = await response.json()
        return data;

    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};



module.exports.fetchUserProfile = async (userId) => {
    try {
        const response = await fetch(`https://snapverse-6nqx.onrender.com/api/user/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json(); 

        return data;
    } catch (error) {
        console.error(`Error fetching profile for user :${userId}`, error);
        throw error;
    }
};

module.exports.fetchOnlineUsers = async ()=> {
    const response = await fetch('https://snapverse-6nqx.onrender.com/home/online-users');
    if (!response.ok) throw new Error('Failed to fetch online users');
    return await response.json(); // Return the users array
}

