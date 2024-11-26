const Trip = require('../models/Trip');
const User = require('../models/User');
const FavoriteState = require('../models/FavoriteState');
const {getUserById} = require("../controllers/userController");
const {getTripById} = require("../controllers/getTrips");
const {getFavoriteStateByName} = require("../controllers/favoriteController");
const {getDayById} = require("../controllers/dayController");
const {v4: uuidv4} = require('uuid');

exports.ratingTripService = async (user, tripId, rating, userId) => {
    user.rate += 1;
    await user.save();
    // Early exit if the rating is low
    if (rating < 4) {
        return {
            message: 'Rating is low',
            redirectUrl: '/main-dashboard',
        };
    }
    // Fetch trip details if the rating is high
    const tripData = await getTripById(tripId);
    if (!tripData) {
        throw new Error('Trip not found');
    }
    // Add to the user's favorite states if not already present
    const state = tripData.trip.state;
    if (!user.favoriteStates.includes(state)) {
        user.favoriteStates.push(state);
        await user.save();
    }
    // Add user to the favorite states list
    const favTrip = await getFavoriteStateByName(state);
    // Create a new favorite state if it doesn't exist
    if (!favTrip) {
        const newState = new FavoriteState({
            state: state,
            userId: [userId],
        });
        await newState.save();
    } else {
        if (!favTrip.userId.includes(userId)) {
            favTrip.userId.push(userId);
            await favTrip.save();
        }
    }
    return {
        message: 'User rating updated successfully',
        redirectUrl: '/main-dashboard',
    };
};

exports.getTripByRatingService = async (userId) => {
    const user = await getUserById(userId); // Fetch user details
    if (!user) {
        throw new Error('User not found');
    }
    const favoriteStates = user.favoriteStates;
    const topRatedUsers = {};
    // Iterate over the user's favorite states, and find the top-rated user for each state
    for (const state of favoriteStates) {
        // Fetch favorite state details, which contains the list of user IDs who rated the state highly
        const currentFavState = await getFavoriteStateByName(state);
        const userIdsArray = currentFavState.userId; // Get the list of user IDs
        let topRatedUserId = null;
        let max = 0;
        // Iterate over the list of user IDs and find the top-rated user
        for (const id of userIdsArray) {
            // Skip the current logged-in user
            if (id === userId) {
                continue;
            }
            // Fetch user details of the current user who rated the state highly
            const currentUser = await getUserById(id);
            // Update the top-rated user if the current user has a higher rating
            if (currentUser.rate > max) {
                max = currentUser.rate;
                topRatedUserId = id;
            }
        }
        // Add the top-rated user to the dictionary
        if (topRatedUserId) {
            topRatedUsers[topRatedUserId] = (topRatedUsers[topRatedUserId] || 0) + 1;
        }
    }
    return topRatedUsers;
};


exports.getTopRatedUser = async (userId) => {
    const topRatedUsers = await exports.getTripByRatingService(userId);
    // If no top-rated users are found, return the user with the highest rate
    if (!topRatedUsers) {
        const allUsers = await User.find().sort({rate: -1}).limit(1); // Get the user with the highest rate
        if (allUsers.length > 0) {
            return allUsers[0]._id;
        }
        return null;
    }
    let maxCount = 0;
    let topUserId = null;
    // Find the user with the maximum value in topRatedUsers
    for (const [id, count] of Object.entries(topRatedUsers)) {
        if (count > maxCount) {
            maxCount = count;
            topUserId = id;
        }
    }
    // Return the user with the maximum value (or one of them if there are multiple)
    if (topUserId) {
        return topUserId;
    }
    // If no user has the maximum value, retrieve the user with the highest rate (or one of them if there are multiple)
    let maxRate = 0;
    let highestRatedUser = null;
    for (const id of Object.keys(topRatedUsers)) {
        const user = await getUserById(id);
        if (user.rate > maxRate) {
            maxRate = user.rate;
            highestRatedUser = id;
        }
    }
    return highestRatedUser;
};

exports.getSurprisingTrip = async (userId) => {
    try {
        // Fetch user details
        const user = await getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Get user's favorite states
        const favoriteStates = user.favoriteStates;
        if (favoriteStates.length === 0) {
            throw new Error('No favorite states found for the user');
        }
        // Choose a random state from the user's favorite states
        const randomState = favoriteStates[Math.floor(Math.random() * favoriteStates.length)];
        // Query the trips database to find a trip in the chosen state
        const trip = await Trip.findOne({state: randomState, userId: userId});
        if (!trip) {
            throw new Error('No trip found for the user in the chosen state');
        }
        // Return the trip details
        return trip;
    } catch (err) {
        console.error('Error fetching surprising trip:', err);
        throw err;
    }
}

exports.retrieveTripData = async (tripId, userId, res) => {
    try {
        const trip = await Trip.findById(tripId).populate('days'); // Fetch trip and populate days
        if (!trip) {
            if (res) {
                return res.status(404).json({message: 'Trip not found'});
            }
            throw new Error('Trip not found');
        }
        // Save the trip to the database
        const saveTrip = new Trip({
            state: trip.state,
            cities: trip.cities,
            numberOfTravelers: trip.numberOfTravelers,
            typeOfTrip: trip.typeOfTrip,
            userId: userId,
            tripID: uuidv4(),
            days: trip.days,
        });
        await saveTrip.save();
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