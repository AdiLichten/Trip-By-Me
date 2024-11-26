const Trip = require('../models/Trip');
const {getDayById} = require('../controllers/dayController');


const getAllTrips = async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await Trip.find({userId}); // Fetch trips that match the logged-in user's ID
        res.status(200).json(trips);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};
const retrieveTripData = async (req, res = null) => {
    const {id} = req.params; // Get trip ID from request params
    try {
        const trip = await Trip.findById(id).populate('days'); // Fetch trip and populate days
        if (!trip) {
            if (res) {
                return res.status(404).json({message: 'Trip not found'});
            }
            throw new Error('Trip not found');
        }
        // Fetch day plans for each day in the trip and return them as an array
        const allDayPlans = await Promise.all(
            trip.days.map(async (day) => {
                return await getDayById(day._id);
            })
        );
        if (res) {
            return res.status(200).json({
                message: 'Trip found successfully',
                trip,
                dayPlans: allDayPlans,
                redirectUrl: '/day',
            });
        }
        // If res is not provided, return the trip and day plans directly
        return {trip, dayPlans: allDayPlans, redirectUrl: '/day'};
    } catch (err) {
        if (res) {
            console.error('Error fetching trip:', err);
            return res.status(500).json({message: err.message});
        }
        throw err;
    }
};

const getTripById = async (id) => {
    try {
        const trip = await Trip.findById(id); // Fetch trip by trip ID
        if (!trip) {
            throw new Error('Trip not found');
        }
        return {trip};
    } catch (err) {
        throw err;
    }
};

module.exports = {
    retrieveTripData,
    getAllTrips,
    getTripById,
};
