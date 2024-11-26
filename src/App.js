import React from "react";
import Login from "./login/login";
import OpenScreen from "./open_screen/OpenScreen";
import CreateTrip from "./create_trip/Create_Trip";
import {Routes, Route} from "react-router-dom";
import MainDashboard from "./main_dashboard_after_login/MainDashboard";
import TripsList from "./TripsList/TripsList";
import Day from "./Day/Day";
import PrivateRoute from "./PrivateRoute";
import Rating from "./Rating/Rating";

export const App = () => {
    return (
        <Routes>
            <Route path="/" element={<OpenScreen/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/open-screen" element={<OpenScreen/>}/>
            <Route path="/create-trip" element={<PrivateRoute element={CreateTrip}/>}/>
            <Route path="/main-dashboard/create-trip" element={<PrivateRoute element={CreateTrip}/>}/>
            <Route path="/former-trips" element={<PrivateRoute element={TripsList} status="former"/>}/>
            <Route path="/main-dashboard/former-trips"
                   element={<PrivateRoute element={TripsList} status="former"/>}/>
            <Route path="/upcoming-trips" element={<PrivateRoute element={TripsList} status="upcoming"/>}/>
            <Route path="/main-dashboard/upcoming-trips"
                   element={<PrivateRoute element={TripsList} status="upcoming"/>}/>
            <Route path="/main-dashboard" element={<PrivateRoute element={MainDashboard}/>}/>
            <Route path="/day" element={<PrivateRoute element={Day}/>}/>
            <Route path="/rating" element={<PrivateRoute element={Rating}/>}/>
        </Routes>
    );
};

export default App;