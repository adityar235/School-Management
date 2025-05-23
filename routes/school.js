const express = require('express');
const router = express.Router();
const db = require('../db');

router.use((req, res, next) => {
  console.log(`School route accessed: ${req.method} ${req.path}`);
  next();
});

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'School routes are working!'
  });
});

router.post('/addSchool', async (req, res) => {
  try {
    console.log('Request body:', req.body); 
    
    const { name, address, latitude, longitude } = req.body;
    
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required and must be valid'
      });
    }

    const [result] = await db.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name, address, parseFloat(latitude), parseFloat(longitude)]
    );

    res.status(201).json({
      success: true,
      message: 'School added successfully',
      schoolId: result.insertId
    });
  } catch (error) {
    console.error('Add school error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add school',
      error: error.message
    });
  }
});

// List schools
router.get('/listSchools', async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    
    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'Valid latitude and longitude are required'
      });
    }

    const [schools] = await db.query('SELECT * FROM schools');
    
    const schoolsWithDistance = schools.map(school => ({
      ...school,
      distance: calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        school.latitude,
        school.longitude
      ).toFixed(2)
    })).sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      data: schoolsWithDistance
    });
  } catch (error) {
    console.error('List schools error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schools',
      error: error.message
    });
  }
});

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * 
    Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router;