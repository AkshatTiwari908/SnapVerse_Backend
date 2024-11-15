/* const LRU= require('lru-cache');
const cache = new LRU({
    max: 100,                  // Maximum number of items to cache
    ttl: 1000 * 60 * 10        // Time-to-live in milliseconds (10 minutes)
});
 */

module.exports.fetchPosts = async () => {
  /*   const cacheKey = 'posts'; // Unique cache key for posts
    if (cache.has(cacheKey)) {
        console.log('cache memory triggered')
        return cache.get(cacheKey); // Return cached posts if available
    } */

    try {
        const response = await fetch('https://snapverse-6nqx.onrender.com/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json(); // Fetch and parse posts data
/* 
        cache.set(cacheKey, data); */ // Cache the posts data
        return data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error; // Re-throw to handle at a higher level if needed
    }
};

module.exports.fetchUserProfile = async (userId) => {
 /*    const cacheKey = `userProfile-${userId}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey); 
    } */

    try {
        const response = await fetch(`https://snapverse-6nqx.onrender.com/api/user/profile/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json(); 
/* 
        cache.set(cacheKey, data); */
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

