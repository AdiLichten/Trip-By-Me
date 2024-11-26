import React, {useEffect, useState} from "react";
import "./MainDashboard.css";
import {useNavigate} from "react-router-dom";
import {auth, signOut} from "../firebaseConfig";
import Chatbot from "../Chatbot/Chatbot";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

function MainDashboard() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, []);
    const handleClickCreateTrip = () => {
        navigate("/main-dashboard/create-trip");
    };
    const handleClickFormerTrips = () => {
        navigate("/main-dashboard/former-trips");
    };
    const handleClickUpcomingTrips = () => {
        navigate("/main-dashboard/upcoming-trips");
    };

    const handleClickSurpriseMe = async () => {
        try {
            const response = await axios.post(
                'http://localhost:5001/api/tripByRating',
                {
                    userId,
                }
            );
            navigate(response.data.redirectUrl, {state: response.data});
        } catch (error) {
            console.error("Error fetching surprise trip:", error);
            alert('Failed to fetch surprise trip. Please try again later.');
        }
    };
    const handleClickLogout = async () => {
        try {
            await signOut(auth); // Sign out the user from Firebase
            localStorage.removeItem('token'); // Clear the token from localStorage
            navigate("/"); // Redirect to the login screen
        } catch (error) {
            console.error("Error during logout:", error);
            alert('Logout failed. Please try again.');
        }
    };


    return (
        <div className="main-dashboard">
            <div className="main-dashboard-overlap-group-wrapper">
                <div className="main-dashboard-headlines">
                    <h1 className="main-dashboard-trip-me">
                        Trip<span className="main-dashboard-by">by</span>Me
                    </h1>
                    <p className="main-dashboard-plan-your-next">
                        Plan your next travel
                    </p>
                </div>
                <div className="main-dashboard-overlap">
                    <button className="main-dashboard-button_lets" onClick={handleClickCreateTrip}>
                        <div className="main-dashboard-text-lets">Let’s create a new trip now!</div>
                    </button>
                    <div className="button-container">
                        <button className="button_options" onClick={handleClickFormerTrips}>
                            <div className="main-dashboard-text-options">Former trips</div>
                        </button>
                        <button className="button_options" onClick={handleClickUpcomingTrips}>
                            <div className="main-dashboard-text-options">Upcoming trips</div>
                        </button>
                    </div>
                    <button className="button_options" onClick={handleClickSurpriseMe}>
                        <div className="main-dashboard-text-options">Surprise Me!</div>
                    </button>
                </div>
                <button className="button_logout" onClick={handleClickLogout}>
                    <div className="omain-dashboard-text-logout">logout</div>
                </button>
            </div>
            <Chatbot/>
        </div>
    );
}

export default MainDashboard;
