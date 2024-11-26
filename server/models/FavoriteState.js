const mongoose = require('mongoose');

const favoriteState = new mongoose.Schema({
    state: {type: String, required: true},
    userId: {type: Array, required: true, default: []},
});

const FavoriteState = mongoose.model('FavoriteState', favoriteState);

module.exports = FavoriteState;