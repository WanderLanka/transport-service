const { start, installReadiness } = require('../runtime');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();
installReadiness(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Transport Service'
  });
});

// Routes
app.use('/', vehicleRoutes); // Mount vehicle routes at root
app.use('/transport', vehicleRoutes); // Also mount at /transport for clarity

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


if (require.main === module) {
  start(app, { connect: connectDB, port: process.env.PORT || 3002 }).catch(error => {
    console.error('Service startup failed:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
