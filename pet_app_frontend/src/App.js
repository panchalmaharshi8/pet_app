import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import PetsPage from './pages/PetsPage';
import PetProfile from './pages/PetProfile';
import Dashboard from './pages/Dashboard';
import RequestRecords from './pages/RequestRecords';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const updateAuthState = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login updateAuthState={updateAuthState} />} />
        <Route path="/register" element={<Register />} />

        {isAuthenticated ? (
          <>
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/pets/:id" element={<PetProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request-records" element={<RequestRecords />} />
            <Route path="*" element={<Navigate to="/pets" />} /> {/* If logged in, go to pets */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} /> // ❗ Forces login every time
        )}
      </Routes>
    </Router>
  );
}

export default App;
