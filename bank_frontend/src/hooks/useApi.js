import { useState, useCallback } from 'react';
import API from '../services/api';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = null, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                method,
                url,
                ...options,
            };

            if (data) {
                config.data = data;
            }

            const response = await API(config);
            return response.data;

        } catch (err) {
            const errorMessage = err.response?.data?.detail ||
                                 err.message ||
                                 'An unexpected error occurred';
            setError(errorMessage);
            throw err;

        } finally {
            setLoading(false);
        }
    }, []);

    return { request, loading, error };
};