// controllers/clinicsController.js
const axios = require('axios');

exports.getNearbyClinics = async (req, res) => {
  const { lat, lng } = req.query;

  console.log('📡 Incoming GET /api/clinics');
  console.log('📍 Query Params → lat:', lat, 'lng:', lng);

  if (!lat || !lng) {
    console.warn('⚠️ Missing coordinates');
    return res.status(400).json({ error: 'Latitude and longitude required.' });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.results) {
      console.warn('⚠️ No results returned from Google Maps');
      return res.status(200).json([]); // return empty array to prevent frontend error
    }

    const formatted = response.data.results.map((place) => ({
        name: place.name,
        description: place.vicinity,
        location: place.geometry.location, // 👈 includes { lat, lng }
        image: place.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : 'https://via.placeholder.com/150',
        time: 'N/A',
        date: 'Today',
      }));
      

    // const formatted = response.data.results.map((place) => ({
    //   name: place.name,
    //   description: place.vicinity,
    //   image: place.photos?.[0]
    //     ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
    //     : 'https://via.placeholder.com/150',
    //   time: 'N/A',
    //   date: 'Today',
    // }));

    console.log('✅ Sending back', formatted.length, 'clinics');
    res.json(formatted);
  } catch (error) {
    console.error('❌ Error fetching clinics:', error.message);
    res.status(500).json({ error: 'Failed to fetch clinics from Google Maps API' });
  }
};
