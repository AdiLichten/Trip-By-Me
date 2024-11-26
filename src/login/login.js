import React from 'react';
import './login.css';
import {useNavigate} from 'react-router-dom';
import {auth, GoogleAuthProvider, signInWithPopup} from '../firebaseConfig';
import axios from 'axios';

function Screen() {
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider(); // Create a Google auth provider
        try {
            const result = await signInWithPopup(auth, provider); // Sign in with Google
            const user = result.user; // Get the signed-in user
            const idToken = await user.getIdToken(); // Get the ID token
            // Send the ID token to the server
            const response = await axios.get('http://localhost:5001/api/login', {
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
            });
            const token = response.data.token; // Get the token from the response
            localStorage.setItem('token', token); // Store the token
            navigate(response.data.redirectUrl); // Navigate to the next page
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-screen-top">
                <p className="login-screen-trip-by-me">
                    <span>Trip</span> by <span>Me</span>
                </p>
                <p className="login-screen-plan-your-next">
                    Plan your next travel
                </p>
            </div>
            <div className="login-overlap-group">
                <button className="login-button-login" onClick={handleGoogleSignIn}>
                    Login or sign up with Google
                </button>
            </div>
        </div>
    );
}

export default Screen;