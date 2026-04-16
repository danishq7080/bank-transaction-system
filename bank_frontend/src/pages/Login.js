import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import LoadingSpinner from '../components/LoadingSpinner';
import '../App.css';

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { loading, error, request } = useApi();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [submitError, setSubmitError] = useState('');

    const validateForm = () => {
        const errors = {};

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});
        setSubmitError('');

        try {
            const formBody = new URLSearchParams();
            formBody.append('username', formData.email);
            formBody.append('password', formData.password);

            const response = await request('POST', '/login', formBody, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            login({ email: formData.email }, response.access_token);
            navigate('/dashboard');

        } catch (err) {
            setSubmitError(error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2 style={{ textAlign: "center" }}>Login</h2>

                {submitError && (
                    <div className="alert error" role="alert">
                        {submitError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            aria-invalid={!!validationErrors.email}
                            aria-describedby={validationErrors.email ? "email-error" : undefined}
                            disabled={loading}
                        />
                        {validationErrors.email && (
                            <span id="email-error" className="error-text">
                                {validationErrors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            aria-invalid={!!validationErrors.password}
                            aria-describedby={validationErrors.password ? "password-error" : undefined}
                            disabled={loading}
                        />
                        {validationErrors.password && (
                            <span id="password-error" className="error-text">
                                {validationErrors.password}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: "center", marginTop: "15px" }}>
                    Don&apos;t have an account?
                </p>

                <button
                    type="button"
                    className="btn-dark"
                    onClick={() => navigate('/register')}
                    disabled={loading}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default Login;