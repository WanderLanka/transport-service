const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getDrivers,
  getDriverById,
  addDriver,
  updateDriver,
  deleteDriver,
  getAllDriversPublic,
  getDriverByIdPublic
} = require('../controllers/driverController');

// Add a debug log to check what route is being received
router.use((req, res, next) => {
  console.log(`🔍 Transport Service received request: ${req.method} ${req.originalUrl}`);
  next();
});

// PUBLIC ENDPOINTS (for normal users browsing)
// Get all drivers for public browsing
router.get('/drivers', getAllDriversPublic);

// Alternative route that might be received from proxy
router.get('/api/transport/drivers', getAllDriversPublic);

// Get specific driver by ID for public viewing
router.get('/drivers/:id', getDriverByIdPublic);
// Alias to support requests forwarded by API Gateway or other clients that keep the prefix
router.get('/api/transport/drivers/:id', getDriverByIdPublic);

// PROVIDER ENDPOINTS (for transport providers - authenticated)
// Get all drivers for authenticated user
router.get('/mydrivers', verifyToken, getDrivers);
// Alias for requests arriving as /api/transport/mydrivers
router.get('/api/transport/mydrivers', verifyToken, getDrivers);

// Get specific driver by ID
router.get('/driver/:id', verifyToken, getDriverById);
// Alias for provider-specific driver details when proxy keeps the /api/transport prefix
router.get('/api/transport/driver/:id', verifyToken, getDriverById);

// Add new driver
router.post('/adddriver', verifyToken, addDriver);
// Alias for requests arriving as /api/transport/adddriver
router.post('/api/transport/adddriver', verifyToken, addDriver);

// Update driver
router.put('/updatedriver/:id', verifyToken, updateDriver);
// Alias for requests arriving as /api/transport/updatedriver/:id
router.put('/api/transport/updatedriver/:id', verifyToken, updateDriver);

// Delete driver
router.delete('/deletedriver/:id', verifyToken, deleteDriver);
// Alias for requests arriving as /api/transport/deletedriver/:id
router.delete('/api/transport/deletedriver/:id', verifyToken, deleteDriver);

module.exports = router;
