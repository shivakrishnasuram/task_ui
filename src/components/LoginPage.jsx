import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';


function LoginPage() {
    const [data, setData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // ✅ Auto-redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        if (token && username) {
            // Optionally, verify token with API or just redirect
            axios.get('http://localhost:5000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(() => {
                    // Token is valid, redirect to tasks page
                    navigate('/tasks');
                })
                .catch(() => {
                    // Invalid/expired token, clear localStorage
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!data.email || !data.password) return setError('Both fields required');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.user.username);
            navigate('/tasks');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

//     <Container maxWidth="sm" className="login-container">
//   <Typography variant="h4" className="login-title">Login</Typography>
//   {error && <Typography className="login-error">{error}</Typography>}
//   ...
//   <Link to="/register" className="register-link">Don't have an account? Register</Link>
// </Container>


    return (
        <Container maxWidth="sm" className='login-container'>
            <Typography className='login-title' variant="h4">Login</Typography>
            {error && <Typography className='login-error' color="error">{error}</Typography>}
            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    label="Email"
                    margin="normal"
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    margin="normal"
                    onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <Button variant="contained" color="primary" type="submit">Login</Button>
            </form>
            <Link to="/register" className='register-link' style={{ display: 'block', marginTop: 16 }}>
                Don't have an account? Register
            </Link>
        </Container>
    );
}

export default LoginPage;
