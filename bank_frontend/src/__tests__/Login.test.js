import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import API from '../services/api';

jest.mock('../services/api');

const renderWithAuth = (component) => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                {component}
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('Login Component', () => {
    it('renders login form', () => {
        renderWithAuth(<Login />);

        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('shows validation error for invalid email', async () => {
        renderWithAuth(<Login />);

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'invalid-email' }
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
        });
    });

    it('shows validation error for empty password', async () => {
        renderWithAuth(<Login />);

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'test@example.com' }
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });
});