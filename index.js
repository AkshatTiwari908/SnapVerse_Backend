const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));

// Connect to MongoDB
const dburl = process.env.MONGODB_URI;
mongoose
    .connect(dburl)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Database connection error:', err));

// Routes
app.use('/posts', postRoutes);
app.use('/posts', commentRoutes); // both routes use /posts as the base path

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
