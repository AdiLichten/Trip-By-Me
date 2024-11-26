const Trip = require('../models/Trip');
const TripsListService = require('../services/TripsListService');

const getTrips = async (req, res) => {
    try {
        const { userId, status } = req.params;
        const trips = status === 'former'
            ? await TripsListService.getFormerTrips(userId)
            : await TripsListService.getUpcomingTrips(userId);
        res.json(trips);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const toggleTripState = async (req, res) => {
    try {
        const tripId = req.params.id;

        // Find the trip first
        const trip = await Trip.findById(tripId);
        if (!trip) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Toggle the expired status
        const updatedTrip = await Trip.findByIdAndUpdate(tripId, { expired: !trip.expired }, { new: true });

        res.json(updatedTrip);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getTrips,
    toggleTripState,
};
