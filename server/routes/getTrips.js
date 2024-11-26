const express = require('express');
const router = express.Router();
const {getAllTrips, retrieveTripData} = require('../controllers/getTrips');

// Define route to get trip details
router.get('/trip/:id', retrieveTripData);
router.get('/trips', getAllTrips);

// Define route to generate days

module.exports = router;
