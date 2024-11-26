import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Rating.css';
import {useLocation, useNavigate} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const Rating = ({tripId}) => {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');

    const location = useLocation();
    tripId = location.state?.tripId?.tripId || location.state?.tripId;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserId(decodedToken.userId);
        }
    }, []);
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async () => {
        if (rating === 0) {
            alert('Please select a rating before submitting.');
            return;
        }
        try {
            const response = await axios.post(`http://localhost:5001/api/rating`, {tripId, rating ,userId});
            setSubmitted(true);
            navigate(response.data.redirectUrl);
        } catch (error) {
            console.error('Error submitting rating:', error);
            alert('Failed to submit rating. Please try again.');
        }
    };

    return (
        <div className="rating-container">
            <h2>Rate Your Trip</h2>
            {submitted ? (
                <p>Thank you for your rating!</p>
            ) : (
                <>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${rating >= star ? 'selected' : ''}`}
                                onClick={() => handleRatingChange(star)}
                            >
                                &#9733;
                            </span>
                        ))}
                    </div>
                    <button onClick={handleSubmit} className="submit-button">Submit Rating</button>
                </>
            )}
        </div>
    );
};

export default Rating;