// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');  // Redirect to dashboard on successful login
        } catch (error) {
            console.error("Login failed:", error.response.data);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container>
            <FormContainer>
                <Title>Login</Title>
                <Form onSubmit={handleLogin}>
                    <Input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <Button type="submit">Login</Button>
                </Form>
            </FormContainer>
        </Container>
    );
};

export default Login;

// Styled Components
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f0f2f5;
`;

const FormContainer = styled.div`
    background-color: #fff;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 100%;
    max-width: 400px;
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    &:focus {
        border-color: #007bff;
        outline: none;
    }
`;

const Button = styled.button`
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #0056b3;
    }
`;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:3000/users/login', { email, password });
//             localStorage.setItem('token', response.data.token);
//             navigate('/dashboard');  // Redirect to dashboard on successful login
//         } catch (error) {
//             console.error("Login failed:", error.response.data);
//             alert('Login failed. Please check your credentials.');
//         }
//     };

//     return (
//         <div>
//             <h2>Login</h2>
//             <form onSubmit={handleLogin}>
//                 <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                 <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                 <button type="submit">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;
