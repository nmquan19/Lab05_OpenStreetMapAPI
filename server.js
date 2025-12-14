const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
// Hugging Face Spaces serves on port 7860 by default
const PORT = 7860;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API endpoint to search for a location in Vietnam
app.get('/api/search-location', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    // Search for the location using Nominatim API (OpenStreetMap)
    const searchUrl = `https://nominatim.openstreetmap.org/search`;
    const searchResponse = await axios.get(searchUrl, {
      params: {
        q: `${location}, Vietnam`,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'VietnamPOIApp/1.0'
      }
    });

    if (searchResponse.data.length === 0) {
      return res.status(404).json({ error: 'Location not found' });
    }

    const locationData = searchResponse.data[0];
    res.json({
      name: locationData.display_name,
      lat: parseFloat(locationData.lat),
      lon: parseFloat(locationData.lon),
      boundingbox: locationData.boundingbox
    });

  } catch (error) {
    console.error('Error searching location:', error.message);
    res.status(500).json({ error: 'Failed to search location' });
  }
});

// API endpoint to get points of interest near a location
app.get('/api/points-of-interest', async (req, res) => {
  try {
    const { lat, lon, radius = 2000 } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Use Overpass API to get points of interest
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    // Query for various types of POIs (tourism, amenities, historic places)
    const query = `
      [out:json][timeout:25];
      (
        node["tourism"](around:${radius},${lat},${lon});
        node["amenity"~"restaurant|cafe|museum|theatre|library|cinema"](around:${radius},${lat},${lon});
        node["historic"](around:${radius},${lat},${lon});
        way["tourism"](around:${radius},${lat},${lon});
        way["amenity"~"restaurant|cafe|museum|theatre|library|cinema"](around:${radius},${lat},${lon});
        way["historic"](around:${radius},${lat},${lon});
      );
      out center 50;
    `;

    const overpassResponse = await axios.post(overpassUrl, query, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    const elements = overpassResponse.data.elements;
    
    // Process and format POIs
    const pois = elements.slice(0, 5).map(element => {
      const poiLat = element.lat || (element.center && element.center.lat);
      const poiLon = element.lon || (element.center && element.center.lon);
      
      return {
        id: element.id,
        name: element.tags.name || 'Unknown',
        type: element.tags.tourism || element.tags.amenity || element.tags.historic || 'point_of_interest',
        lat: poiLat,
        lon: poiLon,
        tags: element.tags
      };
    }).filter(poi => poi.lat && poi.lon && poi.name !== 'Unknown');

    // If we don't have enough POIs, return what we have
    if (pois.length === 0) {
      return res.json({ 
        message: 'No points of interest found in this area',
        pois: []
      });
    }

    res.json({ pois: pois.slice(0, 5) });

  } catch (error) {
    console.error('Error fetching POIs:', error.message);
    res.status(500).json({ error: 'Failed to fetch points of interest' });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
