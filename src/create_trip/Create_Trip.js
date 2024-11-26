import React, {useState} from "react";
import {FaSpinner} from "react-icons/fa";
import "./Create_Trip.css";
import {getNames} from "country-list";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {auth, signOut} from "../firebaseConfig";

function Create_Trip() {
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [days, setDays] = useState('');
    const [selectedCities, setSelectedCities] = useState([]);
    const [numberOfTravelers, setNumberOfTravelers] = useState('');
    const [typeOfTrip, setTypeTrip] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const countries = getNames();
    const navigate = useNavigate();

    const types_of_trips = ['Rest', 'Landscape', 'Family', 'Romantic', 'Sports', 'Culinary', 'Museums'];
    const nums = Array.from({length: 8}, (_, i) => i + 1); // Days range from 1 to 31

    // Fetch cities when a state is selected
    const handleStateChange = async (event) => {
        const selectedState = event.target.value;
        setState(selectedState);
        setSelectedCities([]); // Reset selected cities when a new state is chosen

        try {
            const response = await axios.get(`http://localhost:5001/api/getCities/${selectedState}`);
            setCities(response.data.cities); // Update the cities state with fetched data
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    // Add a city with days to the list of selected cities
    const handleAddCity = () => {
        if (city && days && !selectedCities.find(c => c.city === city)) {
            if (parseInt(days) > 10) {
                alert('We recommend spending a maximum of 10 days in each city to make the most of your trip. Please choose a shorter stay to continue planning your trip.');
                return;
            }
            setSelectedCities([...selectedCities, {city, days}]);
            setCity('');
            setDays('');
        }
    };

    // Remove a city from the list
    const handleRemoveCity = (cityToRemove) => {
        setSelectedCities(selectedCities.filter(c => c.city !== cityToRemove));
    };

    // Handle Enter key press to add a city
    const handleDaysKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleAddCity();
        }
    };

    const handleTypeKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    };

    // Handle form submission to create a trip
    const handleSubmit = async () => {
        if (!state || selectedCities.length === 0 || !numberOfTravelers || !typeOfTrip) {
            alert('Please fill in all required fields.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('User not logged in. Please log in to create a trip.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:5001/api/createTrip',
                {
                    state,
                    cities: selectedCities,
                    numberOfTravelers,
                    typeOfTrip,
                },
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );
            navigate(response.data.redirectUrl, {state: response.data});
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message);
            } else {
                alert('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    const handleClickLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('token');
            navigate("/");
        } catch (error) {
            console.error("Error during logout:", error);
            alert('Logout failed. Please try again.');
        }
    };

    const handleClickHome = () => {
        navigate("/main-dashboard");
    };

    return (
        <div className="create-trip-screen">
            <div className="create-trip-overlap-group-wrapper">
                <div className="trips-button-container">
                    <button className="trips-button_logout" onClick={handleClickLogout}>
                        <div className="omain-dashboard-text-logout">Logout</div>
                    </button>
                    <button className="trips-button_home" onClick={handleClickHome}>
                        <div className="home-icon">🏠</div>
                    </button>
                </div>

                <div className="create-trip-input-for-fields">
                    <select value={state} onChange={handleStateChange} defaultValue="">
                        <option value="" disabled>Select state...</option>
                        {countries.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className="create-trip-input-for-fields">
                    <select value={city} onChange={(e) => setCity(e.target.value)} defaultValue="">
                        <option value="" disabled>Select city...</option>
                        {cities.length ? cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        )) : <option value="" disabled>No cities available</option>}
                    </select>
                </div>

                <div className="create-trip-input-for-fields">
                    <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        onKeyDown={handleDaysKeyDown}
                        placeholder="Number of days"
                        max="10"
                    />
                </div>

                <button className="button-add" onClick={handleAddCity}>Add City</button>

                {selectedCities.length > 0 && (
                    <div className="selected-cities-list">
                        <h4>Selected Cities and Days:</h4>
                        <ul>
                            {selectedCities.map((cityObj, index) => (
                                <li key={index}>
                                    {cityObj.city} - {cityObj.days} days
                                    <button onClick={() => handleRemoveCity(cityObj.city)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="create-trip-input-for-fields">
                    <select value={numberOfTravelers} onChange={(e) => setNumberOfTravelers(e.target.value)}
                            defaultValue="">
                        <option value="" disabled>Select number of travelers...</option>
                        {nums.map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </div>

                <div className="create-trip-input-for-fields">
                    <select value={typeOfTrip} onChange={(e) => setTypeTrip(e.target.value)} defaultValue=""
                            onKeyDown={handleTypeKeyDown}
                    >
                        <option value="" disabled>Select type of trip...</option>
                        {types_of_trips.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <button className="button-create-trip" onClick={handleSubmit}>
                    {loading ? <FaSpinner className="spinner"/> : 'Create a Trip for Me'}
                </button>
            </div>
            <p className="create-trip-title">
                Let us know your vision and we will create your dream trip!
            </p>
        </div>
    );
}

export default Create_Trip;
