// src/pages/RequestRecords.js
import React, { useRef, useEffect, useState } from 'react';
import {
  Box, Container, Typography, Button, Card,
  CardContent, CardMedia, Paper, IconButton
} from '@mui/material';

import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

import { GoogleMap, Marker, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAO_kfi56h66LrDXYSyU11NYljJHgKw7R4';
const mapContainerStyle = {
    width: '100%',
    height: '500px', // or '60vh' for responsive sizing
  };
  

const RequestRecords = () => {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [visibleCount, setVisibleCount] = useState(3);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const mapRef = useRef(null);
  const [zoom, setZoom] = useState(14);
  const { isLoaded } = useLoadScript({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });
  const visibleClinics = clinics.slice(0, visibleCount);

  const fetchClinicsFromBackend = async (lat, lng) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clinics?lat=${lat}&lng=${lng}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setClinics(data);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      console.error('❌ Failed to fetch clinics from backend:', err);
      setClinics([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMoreVisible = () => {
    setVisibleCount((prev) => Math.min(prev + 3, clinics.length));
  };

  const handleShowLess = () => {
    setVisibleCount(3);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        fetchClinicsFromBackend(latitude, longitude);
      },
      (err) => {
        console.error('📍 Geolocation error:', err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <Box sx={{ pb: 7, backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Request Records</Typography>
        <Typography variant="h6" gutterBottom>Nearby Clinics</Typography>

        {visibleClinics.map((clinic, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={clinic.image}
                alt={clinic.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{clinic.name}</Typography>
                <Typography variant="body2" color="text.secondary">{clinic.description}</Typography>
                <Typography variant="caption">📅 {clinic.date} • ⏱ {clinic.time}</Typography>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                  <Button variant="contained" size="small">
                    Request From This Clinic
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Card>
        ))}

        {visibleCount < clinics.length && (
          <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleLoadMoreVisible}>
            Load More
          </Button>
        )}
        {visibleCount > 3 && (
          <Button variant="outlined" fullWidth sx={{ mb: 3 }} onClick={handleShowLess}>
            Show Less
          </Button>
        )}

        <Typography variant="h6" gutterBottom>Browse By Map</Typography>

        {isLoaded && coords.lat && (
          <Box sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative', height: 500, mb: 2 }}>
           <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={coords}
                zoom={13}
                onLoad={(map) => (mapRef.current = map)}
                onZoomChanged={() => {
                    if (mapRef.current) {
                    const currentZoom = mapRef.current.getZoom();
                    setZoom(currentZoom);
                    }
                }}
                >
                {clinics.map((clinic, index) => (
                    <MarkerF
                    key={index}
                    position={clinic.location}
                    onClick={() => setSelectedClinic(clinic)}
                  />
                ))}
            </GoogleMap>

            {/* Popup card overlay */}
            {selectedClinic && (
                <Paper
                    elevation={6}
                    sx={{
                    position: 'absolute',
                    top: 16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                    maxWidth: 360,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    padding: 2,
                    zIndex: 10,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">{selectedClinic.name}</Typography>
                    <IconButton onClick={() => setSelectedClinic(null)}>
                        <CloseIcon />
                    </IconButton>
                    </Box>

                    {/* ✅ Image thumbnail */}
                    <img
                    src={selectedClinic.image || 'https://via.placeholder.com/150'}
                    alt={selectedClinic.name}
                    style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '8px'
                    }}
                    />

                    <Typography variant="body2" color="text.secondary">
                    {selectedClinic.description}
                    </Typography>

                    <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    >
                    Request From This Clinic
                    </Button>
                </Paper>
            )}
          </Box>
        )}
      </Container>

      <BottomNav />
    </Box>
  );
};

export default RequestRecords;

// // src/pages/RequestRecords.js
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   CardMedia,
// } from '@mui/material';

// import BottomNav from '../components/BottomNav';
// import { useNavigate } from 'react-router-dom';

// const GOOGLE_MAPS_API_KEY = 'AIzaSyAO_kfi56h66LrDXYSyU11NYljJHgKw7R4';

// const RequestRecords = () => {
//   const navigate = useNavigate();
//   const [clinics, setClinics] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [nextPageToken, setNextPageToken] = useState(null);
//   const [coords, setCoords] = useState({ lat: null, lng: null });
//   const [visibleCount, setVisibleCount] = useState(3);

//   const visibleClinics = clinics.slice(0, visibleCount);

//   console.log('🐾 Total clinics fetched:', clinics.length);
//   console.log('👀 Currently visible:', visibleClinics.length);
//   console.log('🧭 Coordinates:', coords);

//   const fetchClinics = async (lat, lng, token = null) => {
//     const base = token
//       ? `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${token}&key=${GOOGLE_MAPS_API_KEY}`
//       : `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${GOOGLE_MAPS_API_KEY}`;

//     try {
//       const response = await fetch(`https://cors-anywhere.herokuapp.com/${base}`);
//       const data = await response.json();

//       const formatted = data.results.map((place) => ({
//         name: place.name,
//         description: place.vicinity,
//         image: place.photos?.[0]
//           ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}`
//           : 'https://via.placeholder.com/150',
//         time: 'N/A',
//         date: 'Today',
//       }));

//       setClinics((prev) => [...prev, ...formatted]);
//       setNextPageToken(data.next_page_token || null);
//     } catch (err) {
//       console.error('❌ Failed to fetch places:', err);

//       // fallback test data
//       setClinics([
//         {
//           name: 'Test Clinic 1',
//           description: '123 Main St',
//           image: 'https://via.placeholder.com/150',
//           time: 'N/A',
//           date: 'Today',
//         },
//         {
//           name: 'Test Clinic 2',
//           description: '456 King St',
//           image: 'https://via.placeholder.com/150',
//           time: 'N/A',
//           date: 'Today',
//         },
//         {
//           name: 'Test Clinic 3',
//           description: '789 Queen St',
//           image: 'https://via.placeholder.com/150',
//           time: 'N/A',
//           date: 'Today',
//         },
//         {
//           name: 'Test Clinic 4',
//           description: '999 Bay St',
//           image: 'https://via.placeholder.com/150',
//           time: 'N/A',
//           date: 'Today',
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFetchNextPage = () => {
//     if (nextPageToken && coords.lat && coords.lng) {
//       fetchClinics(coords.lat, coords.lng, nextPageToken);
//     }
//   };

//   const handleLoadMoreVisible = () => {
//     setVisibleCount((prev) => Math.min(prev + 3, clinics.length));
//   };

//   const handleShowLess = () => {
//     setVisibleCount(3);
//   };

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;
//         setCoords({ lat: latitude, lng: longitude });
//         fetchClinics(latitude, longitude);
//       },
//       (err) => {
//         console.error('📍 Geolocation error:', err);
//         setLoading(false);
//       }
//     );
//   }, []);

//   return (
//     <Box sx={{ pb: 7, backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
//       <Container sx={{ mt: 4 }}>
//         <Typography variant="h5" gutterBottom>Request Records</Typography>

//         <Typography variant="h6" gutterBottom>Nearby Clinics</Typography>

//         {visibleClinics.map((clinic, index) => (
//           <Card key={index} sx={{ mb: 2 }}>
//             <Box sx={{ display: 'flex' }}>
//               <CardMedia
//                 component="img"
//                 sx={{ width: 100 }}
//                 image={clinic.image}
//                 alt={clinic.name}
//               />
//               <CardContent sx={{ flex: 1 }}>
//                 <Typography variant="h6">{clinic.name}</Typography>
//                 <Typography variant="body2" color="text.secondary">{clinic.description}</Typography>
//                 <Typography variant="caption">📅 {clinic.date} • ⏱ {clinic.time}</Typography>
//               </CardContent>
//             </Box>
//           </Card>
//         ))}

//         {visibleCount < clinics.length && (
//           <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={handleLoadMoreVisible}>
//             Load More
//           </Button>
//         )}

//         {visibleCount > 3 && (
//           <Button variant="outlined" fullWidth sx={{ mb: 3 }} onClick={handleShowLess}>
//             Show Less
//           </Button>
//         )}

//         {nextPageToken && (
//           <Button variant="text" fullWidth sx={{ mb: 4 }} onClick={handleFetchNextPage}>
//             Fetch More From Google
//           </Button>
//         )}

//         <Box sx={{ mb: 2 }}>
//           <Typography variant="h6" gutterBottom>
//             <img src="https://via.placeholder.com/24" alt="map icon" style={{ verticalAlign: 'middle', marginRight: 8 }} />
//             Browse By Map
//           </Typography>

//           <Box sx={{ borderRadius: 4, overflow: 'hidden', height: 300 }}>
//             <iframe
//               title="Nearby Vets Map"
//               width="100%"
//               height="100%"
//               style={{ border: 0 }}
//               loading="lazy"
//               allowFullScreen
//               src={`https://www.google.com/maps/embed/v1/search?q=vet%20clinics%20near%20me&key=${GOOGLE_MAPS_API_KEY}`}
//             />
//           </Box>
//         </Box>
//       </Container>

//       <BottomNav />
//     </Box>
//   );
// };

// export default RequestRecords;
