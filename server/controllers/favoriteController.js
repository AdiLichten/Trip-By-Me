const FavoriteState = require('../models/FavoriteState');

exports.getFavoriteStateByName = async (name) => {
    try {
        const state = await FavoriteState.findOne({ state: name }); // Ensure await is here
        if (!state) {
            return null;
        }
        return state;
    } catch (err) {
        throw new Error(err.message); // Throw an error for handling in the caller
    }
};
