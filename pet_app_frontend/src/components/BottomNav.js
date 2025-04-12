// src/components/BottomNav.js
import React, { useEffect, useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import ArticleIcon from '@mui/icons-material/Article';
import EmailIcon from '@mui/icons-material/Email';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabValue, setTabValue] = useState('');

  useEffect(() => {
    if (location.pathname === '/pets') setTabValue('pets');
    else if (location.pathname === '/request-records') setTabValue('records');
    else if (location.pathname === '/newsletter') setTabValue('newsletter');
    else setTabValue('');
  }, [location.pathname]);

  const handleNavChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 'pets') navigate('/pets');
    if (newValue === 'records') navigate('/request-records');
    if (newValue === 'newsletter') navigate('/newsletter');
  };

  return (
    <BottomNavigation
      value={tabValue}
      onChange={handleNavChange}
      showLabels
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#cce5d5',
        borderTop: '1px solid #bbb',
        zIndex: 10,
      }}
    >
      <BottomNavigationAction label="My Pets" value="pets" icon={<PetsIcon />} />
      <BottomNavigationAction label="Request Records" value="records" icon={<ArticleIcon />} />
      <BottomNavigationAction label="Newsletter" value="newsletter" icon={<EmailIcon />} />
    </BottomNavigation>
  );
};

export default BottomNav;
