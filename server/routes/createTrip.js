const express = require('express');
const router = express.Router();
const createTripController = require('../controllers/createTripController');
const authenticateToken = require('../controllers/authenticateTokenController');

// Route to create a trip with authentication
router.post('/createTrip', authenticateToken.authenticateToken, createTripController.createTrip);

module.exports = router;
