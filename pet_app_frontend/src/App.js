// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PetsPage from './pages/PetsPage'; // Import the PetsPage component

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/pets">Pets</Link></li> {/* New link to PetsPage */}
                </ul>
            </nav>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/pets" element={<PetsPage />} /> {/* Route to PetsPage */}
                <Route path="/" element={<h2>Home Page Placeholder</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
