import React from 'react';
import {Navigate} from 'react-router-dom';

const PrivateRoute = ({element: Component, ...rest}) => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
        alert('You need to log in first!');
        return <Navigate to="/login"/>;
    }

    return <Component {...rest} />;
};

export default PrivateRoute;
