const mongoose = require('mongoose');

// Define the Day schema
const daySchema = new mongoose.Schema({
    breakfast: {
        restaurant: String,
        location: String,
        link: String, // Link to Google Maps
    },
    morningAttraction: {
        name: String,
        location: String,
        link: String, // Link to Google Maps
    },
    lunch: {
        restaurant: String,
        location: String,
        link: String, // Link to Google Maps
    },
    afternoonAttraction: {
        name: String,
        location: String,
        link: String, // Link to Google Maps
    },
    dinner: {
        restaurant: String,
        location: String,
        link: String, // Link to Google Maps
    },
    eveningAttraction: {
        name: String,
        location: String,
        link: String, // Link to Google Maps
    },
    dayID: String,
    picture: String, // URL of the map image showing all locations
});

// Create the Day model using the schema
const Day = mongoose.model('Day', daySchema);

module.exports = Day;
