import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import './TripsList.css';
import {auth, signOut} from "../firebaseConfig";
import {useNavigate} from "react-router-dom";

function TripsList({status}) {
    const [userId, setUserId] = useState('');
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, []);

    // Fetch trips function
    const fetchTrips = async () => {
        if (!userId) return; // Only proceed if userId is set
        setLoading(true); // Start loading

        try {
            const response = await axios.get(`http://localhost:5001/api/trips-list/${userId}/${status}`);
            setTrips(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false); // End loading
        }
    };

    // Call fetchTrips when userId or status changes
    useEffect(() => {
        fetchTrips();
    }, [userId, status]);

    const handleToggleTrip = async (tripId, currentStatus) => {
        try {
            await axios.patch(`http://localhost:5001/api/trip-toggle/${tripId}`, {
                expired: !currentStatus,
            });
            if (!currentStatus) {
                navigate('/rating', {state: {tripId}});
            }
            // Call fetchTrips to refresh the trips list
            fetchTrips();
        } catch (error) {
            console.error("Error toggling trip:", error);
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

    const handleTripClick = async (tripId) => {
        try {
            const response = await axios.get(`http://localhost:5001/api/trip/${tripId}`);
            navigate(response.data.redirectUrl, {state: response.data});
        } catch (error) {
            console.error('Error fetching trip details:', error);
        }
    };

    return (
        <div className="trips-trips-container">
            {loading ? (
                <p>Loading trips...</p>
            ) : (
                trips.map(trip => (
                    <div key={trip._id} className="trips-trip-box">
                        <h3 onClick={() => handleTripClick(trip._id)} style={{cursor: 'pointer'}}>
                            {trip.state}
                        </h3>
                        <p>Trip Type: {trip.typeOfTrip}</p>
                        <div className="trip-button-container">
                            <button
                                onClick={() => handleToggleTrip(trip._id, trip.expired)}
                                className={trip.expired ? 'make-former' : ''}
                            >
                                {trip.expired ? 'Mark as upcoming trip' : 'Mark as former trip'}
                            </button>
                        </div>
                    </div>
                ))
            )}
            <div className="trips-button-container">
                <button className="trips-button_logout" onClick={handleClickLogout}>
                    <div className="omain-dashboard-text-logout">Logout</div>
                </button>
                <button className="trips-button_home" onClick={handleClickHome}>
                    <div className="home-icon">🏠</div>
                </button>
            </div>
        </div>
    );
}

export default TripsList;
