import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "../styles/RegisterPage.css"

function RegisterPage() {
    const [data, setData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, email, password } = data;
        if (!username || !email || !password) return setError('All fields are required');
        if (!email.includes('@')) return setError('Invalid email');
        if (password.length < 6) return setError('Password too short');

        try {
            await axios.post('http://localhost:5000/api/auth/register', data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (


//         <Container maxWidth="sm" className="register-container">
//   <Typography variant="h4" className="register-title">Register</Typography>
//   {error && <Typography className="register-error">{error}</Typography>}
//   ...
// </Container>

        <Container maxWidth="sm" className='register-container'>
            <Typography className='register-title' variant="h4">Register</Typography>
            {error &&  <Typography className='register-error' color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField fullWidth label="Username" margin="normal" onChange={(e) => setData({ ...data, username: e.target.value })} />
                <TextField fullWidth label="Email" margin="normal" onChange={(e) => setData({ ...data, email: e.target.value })} />
                <TextField fullWidth label="Password" type="password" margin="normal" onChange={(e) => setData({ ...data, password: e.target.value })} />
                <Button variant="contained" color="primary" type="submit">Register</Button>
            </form>
            <Link to="/login" style={{ display: 'block', marginTop: 16 }}>
                Already have an account? Login
            </Link>
        </Container>
    );
}

export default RegisterPage;
