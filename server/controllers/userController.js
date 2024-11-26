const User = require('../models/User');

exports.getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        return user; // Return the user
    } catch (err) {
        throw new Error(err.message); // Throw an error for handling in the caller
    }
};
