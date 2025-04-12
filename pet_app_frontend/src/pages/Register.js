import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/auth/signup', {
                name,
                email,
                password,
                confirmPassword,
            });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h1" color="primary" gutterBottom>
                Create New Account
            </Typography>
            <Box component="form" onSubmit={handleRegister} sx={{ mt: 3 }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Sign Up
                </Button>
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
                Already Registered?{' '}
                <Link onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#3CB371' }}>
                    Sign in here.
                </Link>
            </Typography>
        </Container>
    );
};

export default Register;


// // src/pages/Register.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Register = () => {
//     const [name, setName] = useState(''); // Single name field
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const navigate = useNavigate();

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.post('http://localhost:3000/auth/signup', {
//                 name,               // Use single name field
//                 email,
//                 password,
//                 confirmPassword,
//             });
//             alert('Verification email sent! Please check your inbox.');
//             navigate('/login'); // Redirect to login after registration
//         } catch (error) {
//             console.error("Registration failed:", error.response?.data || error.message);
//             alert('Registration failed. Please try again.');
//         }
//     };

//     return (
//         <div>
//             <h2>Register</h2>
//             <form onSubmit={handleRegister}>
//                 <input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                 />
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Register;
