const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    state: {type: String, required: true},
    cities: {type: Array, required: true},
    numberOfTravelers: {type: Number},
    typeOfTrip: {type: String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    days: [{type: mongoose.Schema.Types.ObjectId, ref: 'Day'}],
    tripID: {type: String, required: true, unique: true},
    expired: {type: Boolean, default: false},
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;