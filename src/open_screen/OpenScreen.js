import React from "react";
import "./OpenScreen.css";
import {useNavigate} from "react-router-dom";

function OpenScreen() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/login");
    };

    return (
        <div className="open-main-screen">
            <div className="open-screen-headlines">
                <h1 className="open-screen-trip-me">
                    Trip<span className="open-screen-by">by</span>Me
                </h1>
                <p className="open-screen-plan-your-next">
                    Plan your next travel
                </p>
            </div>
            <div className="open-screen-content">
                <button className="open-screen-button_lets" onClick={handleClick}>
                    Let’s get started
                </button>
            </div>
        </div>
    );
}

export default OpenScreen;
