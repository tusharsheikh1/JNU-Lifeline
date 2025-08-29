const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const config = require('./config/env');

// Import routes
const locationRoutes = require('./routes/locations');
const donorRoutes = require('./routes/donors');

const app = express();
const PORT = config.PORT;

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/locations', locationRoutes);
app.use('/api/donors', donorRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'Blood Donor API Server is running!',
    status: 'success',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    database: 'Connected',
    endpoints: {
      locations: '/api/locations',
      donors: '/api/donors',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({
    status: 'success',
    server: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Blood Donor API v1.0',
    endpoints: {
      locations: {
        divisions: 'GET /api/locations/divisions',
        districts: 'GET /api/locations/districts/:division',
        thanas: 'GET /api/locations/thanas/:district',
        hierarchy: 'GET /api/locations/hierarchy',
        search: 'GET /api/locations/search?q=term&type=all',
        validate: 'GET /api/locations/validate?division=X&district=Y&thana=Z',
        bloodGroups: 'GET /api/locations/blood-groups'
      },
      donors: {
        stats: 'GET /api/donors/stats?division=X&district=Y',
        search: 'GET /api/donors/search?bloodGroup=X&division=Y&district=Z&thana=W',
        register: 'POST /api/donors/register'
      }
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    message: 'Route not found',
    status: 'error',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    message: 'Something went wrong!',
    status: 'error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  process.exit(0);
});

module.exports = app;