require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const vehicleRoutes = require('./routes/vehicleRoutes');

const app = express();

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
  console.log('Authorization header:', req.headers.authorization);
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

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 3002;
    app.listen(PORT, () => {
      console.log(`🔐 Transport service running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`📋 Available endpoints:`);
      console.log(`   GET /vehicles - Get user vehicles`);
      console.log(`   GET /vehicles/all - Get all available vehicles`);
      console.log(`   POST /vehicles - Create vehicle`);
      console.log(`   PUT /vehicles/:id - Update vehicle`);
      console.log(`   DELETE /vehicles/:id - Delete vehicle`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;