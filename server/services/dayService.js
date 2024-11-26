const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.GOOGLE_PLACES_API_KEY;

// Helper function to generate a Google Maps link from a place_id
const generateGoogleMapsLink = (placeId) => `https://www.google.com/maps/place/?q=place_id:${placeId}`;

// Fetch top attractions from Google Places API based on type of trip
const getTopAttractions = async (city, state, type) => {
    const query = `${type}+attractions+in+${city},+${state}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

    try {
        const response = await axios.get(url, {
            params: {query, key: apiKey}
        });

        return response.data.results.map((place) => ({
            name: place.name,
            location: place.formatted_address,
            link: generateGoogleMapsLink(place.place_id),
        })).sort((a, b) => b.rating - a.rating).slice(0, 30);
    } catch (error) {
        console.error('Error fetching attractions:', error);
        return [];
    }
};

// Fetch top restaurants based on type of trip
const getRestaurantsByType = async (city, state, typeOfTrip) => {
    const query = `${typeOfTrip}+restaurants+in+${city},+${state}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json`;

    try {
        const response = await axios.get(url, {
            params: {query, key: apiKey}
        });

        // Sort by rating and limit results to top 10
        return response.data.results.map((place) => ({
            name: place.name,
            location: place.formatted_address,
            link: generateGoogleMapsLink(place.place_id),
        })).sort((a, b) => b.rating - a.rating).slice(0, 30);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};

module.exports = {
    getTopAttractions,
    getRestaurantsByType
};
