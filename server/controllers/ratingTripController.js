const {ratingTripService, getTopRatedUser, getSurprisingTrip, retrieveTripData} = require('../services/ratingService');
const {getUserById} = require("./userController");

const ratingTrip = async (req, res) => {
    try {
        const {tripId, rating, userId} = req.body;
        const user = await getUserById(userId); // Fetch user details
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const result = await ratingTripService(user, tripId, rating, userId);
        res.status(200).json({
            message: result.message,
            redirectUrl: result.redirectUrl,
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

const getTripByRating = async (req, res) => {
    try {
        const {userId} = req.body;
        const topRatedUserId = await getTopRatedUser(userId);
        const trip = await getSurprisingTrip(topRatedUserId);
        return await retrieveTripData(trip._id,userId, res);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

module.exports = {
    ratingTrip,
    getTripByRating,
};
