const express = require('express');
const http = require("http");
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const custumeEnv = require('custom-env');
const app = express();

// Load environment variables
custumeEnv.env(process.env.NODE_ENV, './config');

// Middleware setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json({limit: "1000mb"}));
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully.');
    // Create and start the server
    const server = http.createServer(app);
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error('MongoDB connection error:', err.message);
});

const authRoutes = require('./routes/authRoutes');
const createTripRoutes = require('./routes/createTrip');
const cityRoutes = require('./routes/cityRoutes');
const tripsListRoutes = require('./routes/TripsListRoutes');
const getTrips = require('./routes/getTrips');
const chatbotRoutes = require('./routes/chatbotRoutes');
const ratingTrip = require('./routes/ratingTrip');


app.use('/api', authRoutes);
app.use('/api', createTripRoutes);
app.use('/api', cityRoutes);
app.use('/api', tripsListRoutes);
app.use('/api', getTrips);
app.use('/api', chatbotRoutes);
app.use('/api', ratingTrip);

// Export the app for testing
module.exports = app;
