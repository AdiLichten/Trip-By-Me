const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');

// Define the route to get cities by state
router.get('/getCities/:state', cityController.getCitiesByState);

module.exports = router;
