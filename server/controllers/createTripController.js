const Trip = require('../models/Trip');
const {generateDayPlans} = require('./dayController');
const {v4: uuidv4} = require('uuid');

exports.createTrip = async (req, res) => {
    try {
        const {state, cities, numberOfTravelers, typeOfTrip} = req.body;
        const userId = req.user.userId;

        // Validate input
        if (!state || !cities.length || !numberOfTravelers || !typeOfTrip) {
            return res.status(400).json({message: 'Missing required fields'});
        }

        // Create a new trip
        const trip = new Trip({
            state,
            cities,
            numberOfTravelers,
            typeOfTrip,
            userId,
            tripID: uuidv4(),
        });

        const allDayPlans = [];

        // Generate day plans for each city
        for (const {city, days} of cities) {
            const dayPlans = await generateDayPlans(city, state, typeOfTrip, days);
            allDayPlans.push(...dayPlans);
        }

        // Save trip to the database
        trip.days = allDayPlans.map(plan => plan._id);
        await trip.save();

        return res.status(201).json({
            message: 'Trip created successfully',
            trip,
            dayPlans: allDayPlans,
            redirectUrl: '/day',
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
