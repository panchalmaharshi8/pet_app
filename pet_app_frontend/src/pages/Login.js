import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ updateAuthState }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });

            // Save the token to localStorage
            localStorage.setItem('token', response.data.token);

            // Update the authentication state
            if (updateAuthState) updateAuthState();

            // Navigate to the pets page
            navigate('/pets');
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h1" color="primary" gutterBottom>
                Log-In
            </Typography>
            <Typography variant="body1">
                Not Registered?{' '}
                <Link onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: '#3CB371' }}>
                    Sign up here.
                </Link>
            </Typography>
            <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
