const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Enhanced Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Import and mount routes
const schoolRoutes = require('./routes/school');
console.log('School routes loaded successfully'); // Verification log
app.use('/api', schoolRoutes);

// 404 Handler
app.use((req, res) => {
  console.log(`404: Route not found - ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});