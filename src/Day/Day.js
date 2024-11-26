import React, {useRef, useState} from 'react';
import './Day.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {auth, signOut} from "../firebaseConfig";

function Day() {
    const location = useLocation();
    const {state} = location;
    const dayRef = useRef(null);
    const {dayPlans} = state;
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const navigate = useNavigate();

    // Function to handle the next day button
    const handleNextDay = () => {
        if (currentDayIndex < dayPlans.length - 1) {
            setCurrentDayIndex(currentDayIndex + 1);
            if (dayRef.current) {
                dayRef.current.scrollTo({top: 0, behavior: 'smooth'});
            }
        }
    };

    // Function to handle the previous day button
    const handlePrevDay = () => {
        if (currentDayIndex > 0) {
            setCurrentDayIndex(currentDayIndex - 1);
            if (dayRef.current) {
                dayRef.current.scrollTo({top: 0, behavior: 'smooth'});
            }
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

    const currentDayPlan = dayPlans[currentDayIndex]; // Get the current day plan
    const currentCity = currentDayPlan.dayID.split('-')[0]; // Extract city name from dayID

    return (
        <div className="day" ref={dayRef}>
            <div className="trips-button-container">
                <button className="trips-button_logout" onClick={handleClickLogout}>
                    <div className="omain-dashboard-text-logout">Logout</div>
                </button>
                <button className="trips-button_home" onClick={handleClickHome}>
                    <div className="home-icon">🏠</div>
                </button>
            </div>
            <h1>Day {currentDayIndex + 1} - {currentCity}</h1>
            <div className="itinerary-section">
                <div className="section-header">
                    <div className="image-circle morning"></div>
                    <h2>Morning</h2>
                </div>
                <div className="activity">
                    <h3>Breakfast</h3>
                    <p><strong>Location:</strong> {currentDayPlan.breakfast.restaurant}</p>
                    <p><a href={currentDayPlan.breakfast.link} target="_blank" rel="noopener noreferrer">View on Map</a>
                    </p>
                </div>
                <div className="activity">
                    <h3>Morning Attraction</h3>
                    <p><strong>Location:</strong> {currentDayPlan.morningAttraction.name}</p>
                    <p><a href={currentDayPlan.morningAttraction.link} target="_blank" rel="noopener noreferrer">View on
                        Map</a></p>
                </div>
            </div>

            <div className="itinerary-section">
                <div className="section-header">
                    <div className="image-circle afternoon"></div>
                    <h2>Afternoon</h2>
                </div>
                <div className="activity">
                    <h3>Lunch</h3>
                    <p><strong>Location:</strong> {currentDayPlan.lunch.restaurant}</p>
                    <p><a href={currentDayPlan.lunch.link} target="_blank" rel="noopener noreferrer">View on Map</a></p>
                </div>
                <div className="activity">
                    <h3>Afternoon Attraction</h3>
                    <p><strong>Location:</strong> {currentDayPlan.afternoonAttraction.name}</p>
                    <p><a href={currentDayPlan.afternoonAttraction.link} target="_blank" rel="noopener noreferrer">View
                        on Map</a></p>
                </div>
            </div>

            <div className="itinerary-section">
                <div className="section-header">
                    <div className="image-circle evening"></div>
                    <h2>Evening</h2>
                </div>
                <div className="activity">
                    <h3>Dinner</h3>
                    <p><strong>Location:</strong> {currentDayPlan.dinner.restaurant}</p>
                    <p><a href={currentDayPlan.dinner.link} target="_blank" rel="noopener noreferrer">View on Map</a>
                    </p>
                </div>
                <div className="activity">
                    <h3>Evening Attraction</h3>
                    <p><strong>Location:</strong> {currentDayPlan.eveningAttraction.name}</p>
                    <p><a href={currentDayPlan.eveningAttraction.link} target="_blank" rel="noopener noreferrer">View on
                        Map</a></p>
                </div>
            </div>

            <div className="navigation-buttons">
                {currentDayIndex > 0 && (
                    <button className="submit-btn" onClick={handlePrevDay}>Previous Day</button>
                )}
                {currentDayIndex < dayPlans.length - 1 && (
                    <button className="submit-btn" onClick={handleNextDay}>Next Day</button>
                )}
            </div>
        </div>
    );
}

export default Day;