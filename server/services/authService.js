const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const admin = require("firebase-admin");

exports.login = async (req, res, token) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token); // Verify Firebase token
        const userEmail = decodedToken.email;
        let user = await User.findOne({username: userEmail}); // Check if user exists in the MongoDB database
        if (!user) {
            // If the user doesn't exist, create a new user
            user = new User({username: userEmail});
            await user.save(); // Save the new user to the database
        }
        const jwtToken = jwt.sign({userId: user._id, email: userEmail}, config.jwtSecret);
        res.json({
            message: 'User logged in successfully',
            token: jwtToken,
            redirectUrl: '/main-dashboard'
        });
        // Generate JWT token
        return jwtToken;
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized: Invalid token'});

    }
};

