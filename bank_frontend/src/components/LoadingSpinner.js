import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ size, message }) => {
    const sizeClasses = {
        small: 'loading-spinner-small',
        medium: 'loading-spinner-medium',
        large: 'loading-spinner-large'
    };

    return (
        <div className="loading-container">
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    message: PropTypes.string
};

LoadingSpinner.defaultProps = {
    size: 'medium',
    message: 'Loading...'
};

export default LoadingSpinner;