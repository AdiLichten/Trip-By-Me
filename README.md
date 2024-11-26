# TripByMe

## Overview
 TripByMe is a comprehensive web application for planning and sharing travel experiences. Designed with the modern traveler in mind, it enables users to create personalized trip plans, discover community trips, and interact with an AI chatbot for assistance. With integrations to Google Maps and Gemini APIs, users benefit from enhanced location details and real-time assistance.
## Features
- **User Authentication:** Secure user registration and login via Firebase.
- **Personalized Trip Planning:** Users can create detailed itineraries, including day-by-day plans for selected cities and activities.
- **Community Trips:** Users can view and use other users' trip plans based on a rating algorithm.
- **AI Chatbot Assistance:** : Users can interact with a chatbot for FAQs or escalate issues to administrators. The chatbot integrates with the Gemini API for extra information when needed.
- **API Integration:** Google Maps API for location details, and Gemini API to enhance travel guidance.

## Demo Video

[![Watch the video](https://img.youtube.com/vi/3qdl5ZH_h-8/0.jpg)](https://youtu.be/3qdl5ZH_h-8)


## Technologies Used
- **Frontend:** React, JavaScript
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** Firebase Authentication
- **APIs:** Google Maps API, Gemini API
- **Utilities:** Axios for HTTP requests
- **Styling:** Custom CSS for layout and responsiveness


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AdiLichten/Final-project---Trip-by-me.git
    cd Final-project---Trip-by-me
    ```

2. Install dependencies for both the client and server:
    ```bash
    npm install
    cd server
    npm install
    ```

3. Set up environment variables:
    - Open the `.env` file in the `server/config` directory and update the following variables:
        ```plaintext
        CONNECTION_STRING=<your_mongodb_uri>
        GOOGLE_PLACES_API_KEY=<your_google_maps_api_key>
        GEMINI_API_KEY=<your_gemini_api_key>
        ```
   - Create a new Firebase project and add the Firebase configuration to the `server/config/serviceAccountKey.json` file.

4. Start the client:
    ```bash
    npm start
    ```
   
5. Start the development server:
    ```bash
    cd server
    npm start
    ```
   
6. **Access the Application:** Open http://localhost:3000 in your browser to view the app.

## Usage

1. **Register/Login:** Secure user registration or login through Firebase authentication.
2. **Create a Trip:** Define your travel preferences by selecting destination state, cities, number of travelers, and trip type.
3. **Explore Community Trips:** Users can view and use other users' trip plans based on a rating algorithm.
4. **Chatbot Support:** Engage with an AI chatbot for assistance or escalate issues to administrators.
5. **Rate Trips:** After completing a trip, rate it from 1 to 5, so that highly rated trips will be added to your favorite states.


## Project Structure

- `src/`: Contains the React frontend code.
- `server/`: Contains the Node.js backend code.
- `models/`: Contains the Mongoose models for MongoDB.
- `controllers/`: Contains the controllers for handling API requests.
- `services/`: Business logic and database interactions.

## License
All rights reserved © Adi and Hadar.

## Contributing
This project does not currently support contributions.