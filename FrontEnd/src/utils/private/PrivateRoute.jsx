import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"                                                   

function PrivateRoute({ requiredRole }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/auth" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;
        if (userRole !== requiredRole) {
            return <Navigate to="/auth" />;
        }
        return <Outlet />;
    } catch (error) {
        return <Navigate to="/auth" />;
    }
};

export default PrivateRoute