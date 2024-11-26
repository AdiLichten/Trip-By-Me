const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    rate: {type: Number, required: true, default: 0},
    favoriteStates: {type: Array, required: true, default: []},
});

const User = mongoose.model('User', userSchema);

module.exports = User;