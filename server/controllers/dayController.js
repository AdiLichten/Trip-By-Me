const Day = require('../models/Day');
const {getTopAttractions, getRestaurantsByType} = require("../services/dayService");
const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GOOGLE_PLACES_API_KEY;

// Convert address to latitude/longitude using Google Places API
async function getCoordinates(location) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json`;
    try {
        const response = await axios.get(url, {
            params: {address: location, key: apiKey},
        });
        const {lat, lng} = response.data.results[0].geometry.location;
        return {lat, lng};
    } catch (error) {
        console.error(`Error getting coordinates for ${location}:`, error);
        return {lat: 0, lng: 0}; // Default to (0,0) if error
    }
}

// Calculate the average center point of multiple locations
function calculateCenter(locations) {
    const total = locations.reduce(
        (acc, loc) => ({lat: acc.lat + loc.lat, lng: acc.lng + loc.lng}),
        {lat: 0, lng: 0}
    );
    return {
        lat: total.lat / locations.length,
        lng: total.lng / locations.length,
    };
}

// Generate a dynamic zoom level based on the spread of locations
function calculateZoom(locations) {
    // Calculate the max distance between locations to determine zoom
    const maxLatDiff = Math.max(...locations.map(loc => loc.lat)) - Math.min(...locations.map(loc => loc.lat));
    const maxLngDiff = Math.max(...locations.map(loc => loc.lng)) - Math.min(...locations.map(loc => loc.lng));
    const maxDiff = Math.max(maxLatDiff, maxLngDiff);

    // Determine zoom level (higher value means more zoomed in)
    if (maxDiff < 0.01) return 15;
    if (maxDiff < 0.05) return 13;
    if (maxDiff < 0.1) return 11;
    return 10; // Default zoom if locations are far apart
}

// Generate the Google Maps Static Map URL
function generateMapImageURL(locations, center, zoom) {
    const baseUrl = `https://maps.googleapis.com/maps/api/staticmap`;
    const markers = locations.map(
        loc => `markers=${loc.lat},${loc.lng}`
    ).join('&');
    return `${baseUrl}?${markers}&center=${center.lat},${center.lng}&zoom=${zoom}&size=600x400&key=${apiKey}`;
}

async function generateDayPlans(city, state, typeOfTrip, numDays) {
    const dayPlans = [];

    try {
        let availableAttractions = await getTopAttractions(city, state, typeOfTrip);
        let availableRestaurants = await getRestaurantsByType(city, state, typeOfTrip);

        availableAttractions = shuffleArray(availableAttractions);
        availableRestaurants = shuffleArray(availableRestaurants);

        const pickAndRemove = (list) => list.shift() || null;

        for (let i = 1; i <= numDays; i++) {
            const breakfastSpot = pickAndRemove(availableRestaurants) || {
                name: `${city} Breakfast Spot`,
                location: `${city} Center`,
                link: ''
            };
            const lunchSpot = pickAndRemove(availableRestaurants) || {
                name: `${city} Lunch Restaurant`,
                location: `${city} Downtown`,
                link: ''
            };
            const dinnerSpot = pickAndRemove(availableRestaurants) || {
                name: `${city} Fine Dining`,
                location: `${city} District`,
                link: ''
            };

            const morningAttraction = pickAndRemove(availableAttractions) || {
                name: `Morning Attraction ${i}`,
                location: `${city} Park`,
                link: ''
            };
            const afternoonAttraction = pickAndRemove(availableAttractions) || {
                name: `Afternoon Activity ${i}`,
                location: `${city} Museum`,
                link: ''
            };
            const eveningAttraction = pickAndRemove(availableAttractions) || {
                name: `Evening Event ${i}`,
                location: `${city} Concert Hall`,
                link: ''
            };

            // Get coordinates for all locations
            const locations = await Promise.all([
                getCoordinates(breakfastSpot.location),
                getCoordinates(lunchSpot.location),
                getCoordinates(dinnerSpot.location),
                getCoordinates(morningAttraction.location),
                getCoordinates(afternoonAttraction.location),
                getCoordinates(eveningAttraction.location),
            ]);

            const center = calculateCenter(locations);
            const zoom = calculateZoom(locations);
            const mapImageURL = generateMapImageURL(locations, center, zoom);

            const dayPlan = new Day({
                breakfast: {
                    restaurant: breakfastSpot.name,
                    location: breakfastSpot.location,
                    link: breakfastSpot.link,
                },
                morningAttraction: {
                    name: morningAttraction.name,
                    location: morningAttraction.location,
                    link: morningAttraction.link,
                },
                lunch: {
                    restaurant: lunchSpot.name,
                    location: lunchSpot.location,
                    link: lunchSpot.link,
                },
                afternoonAttraction: {
                    name: afternoonAttraction.name,
                    location: afternoonAttraction.location,
                    link: afternoonAttraction.link,
                },
                dinner: {
                    restaurant: dinnerSpot.name,
                    location: dinnerSpot.location,
                    link: dinnerSpot.link,
                },
                eveningAttraction: {
                    name: eveningAttraction.name,
                    location: eveningAttraction.location,
                    link: eveningAttraction.link,
                },
                dayID: `${city}-${i}`,
                picture: mapImageURL, // Save the map image URL
            });

            await dayPlan.save();
            dayPlans.push(dayPlan);
        }
    } catch (error) {
        console.error('Error generating day plans:', error);
    }

    return dayPlans;
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to get a day by its ID
async function getDayById(dayId) {
    try {
        const day = await Day.findById(dayId);
        if (!day) {
            throw new Error('Day not found');
        }
        return day;
    } catch (error) {
        console.error(`Error fetching day by ID ${dayId}:`, error);
        throw error; // Rethrow the error for further handling
    }
}

// Export the functions
module.exports = {
    generateDayPlans,
    getDayById, // Add the new function to exports
};