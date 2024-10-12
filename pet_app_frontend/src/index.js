// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: styles for the app
import App from './App'; // Import the root component
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);