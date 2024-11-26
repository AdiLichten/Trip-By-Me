const Trip = require('../models/Trip');

const TripsListService = {

    async getUpcomingTrips(userId) {
        try {
            return await Trip.find({expired: false, userId});
        } catch (error) {
            throw new Error('Error fetching future trips');
        }
    },

    async getFormerTrips(userId) {
        try {
            return await Trip.find({expired: true, userId});
        } catch (error) {
            throw new Error('Error fetching future trips');
        }
    }
};

module.exports = TripsListService;