const express = require('express');
const router = express.Router();
const TripsListController = require('../controllers/TripsListController');

// Route for getting trips
router.get('/trips-list/:userId/:status', TripsListController.getTrips);

// Route for toggling trip state
router.patch('/trip-toggle/:id', TripsListController.toggleTripState);

module.exports = router;
