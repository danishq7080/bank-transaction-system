import React from "react";
import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

      return isAuthenticated ? children : <Navigate to="/" replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;