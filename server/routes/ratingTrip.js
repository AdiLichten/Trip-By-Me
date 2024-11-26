const express = require('express');
const router = express.Router();
const { ratingTrip, getTripByRating} = require('../controllers/ratingTripController');

router.post('/rating', ratingTrip);
router.post('/tripByRating', getTripByRating);

module.exports = router;
