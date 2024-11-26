const User = require('../models/User');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');
const config = require('../config/config');
const serviceAccount = require('../config/serviceAccountKey.json');
const authService = require('../services/authService');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount) // Initialize Firebase Admin with service account key
});

// Login with Google
exports.login = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from authorization header
    if (!token) {
        return res.status(401).json({message: 'Unauthorized: No token provided'});
    }
    try {
        const jwtToken = authService.login(req, res, token);
        return jwtToken;
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized: Invalid token'});
    }
};