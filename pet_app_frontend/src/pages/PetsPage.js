// src/pages/PetsPage.js
import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import BottomNav from '../components/BottomNav'; // ✅ import shared nav

const PetsPage = () => {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState('...');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(res.data.name);
      } catch (err) {
        console.error('Failed to load user name', err);
        setUserName('User');
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/pets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPets(response.data);
      } catch (error) {
        console.error('Failed to fetch pets:', error.message);
      }
    };
    fetchPets();
  }, []);

  return (
    <Box sx={{ pb: 7, backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <Container sx={{ pt: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">User Profile</Typography>
          <Box>
            <IconButton><NotificationsIcon /></IconButton>
            <IconButton><SettingsIcon /></IconButton>
          </Box>
        </Box>

        {/* Your Pets Section */}
        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>Your Pets</Typography>
        <Box sx={{ display: 'flex', overflowX: 'auto', pb: 1 }}>
          {pets.map((pet) => (
            <Card
              key={pet.pet_id}
              sx={{
                minWidth: 150,
                marginRight: 2,
                backgroundColor: '#d6e9dc',
                flex: '0 0 auto',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/pets/${pet.pet_id}`)}
            >
              <CardMedia
                component="img"
                height="100"
                image={`http://localhost:3000${pet.photo_url}`}
                alt={pet.name}
              />
              <CardContent>
                <Typography variant="subtitle2">{pet.name}</Typography>
                <Typography variant="caption" color="textSecondary">{pet.breed}</Typography>
              </CardContent>
            </Card>
          ))}
          {/* Add new pet */}
          <Card
            sx={{
              minWidth: 150,
              height: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e0e0e0',
            }}
            onClick={() => alert('Open modal to add pet')}
          >
            <AddCircleOutlineIcon fontSize="large" />
          </Card>
        </Box>

        {/* Section Title */}
        <Typography variant="subtitle1" sx={{ mt: 3 }}>Recent Activity</Typography>

        {/* Feed/List Items */}
        {[1, 2].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
            <Avatar variant="rounded" sx={{ width: 56, height: 56, mr: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1">Medical Record Uploaded</Typography>
              <Typography variant="caption" color="text.secondary">23 minutes ago</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#aaa' }}>›</Typography>
          </Box>
        ))}
      </Container>

      {/* ✅ Shared bottom navigation */}
      <BottomNav />
    </Box>
  );
};

export default PetsPage;
