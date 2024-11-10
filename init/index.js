const mongoose = require('mongoose');
const Post = require('../models/post.js'); // Adjust path as necessary
const User = require('../models/user.js'); // Adjust path as necessary

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://Rudra:12345@cluster0.k24oa.mongodb.net/myDatabase?retryWrites=true&w=majority';

async function initializeData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Create sample users
        const user1 = new User({ email: "user1@example.com", password: "password1", name: "User One" });
        const user2 = new User({ email: "user2@example.com", password: "password2", name: "User Two" });
        
        await user1.save();
        await user2.save();

        console.log("Sample users created");

        // Create a sample post
        const post = new Post({
            user: user1._id,
            image: {
                url: "http://example.com/image.jpg",
                filename: "image.jpg",
            },
            caption: "This is a sample post",
            likes: [user2._id], // User 2 liked the post
            comments: [
                {
                    user: user2._id,
                    text: "Nice post!",
                }
            ],
            timestamp: new Date(),
        });

        await post.save();

        console.log("Sample post created with comments and likes");

    } catch (error) {
        console.error("Error initializing data:", error);
    } finally {
        // Disconnect from MongoDB
        mongoose.connection.close();
    }
}

initializeData();
