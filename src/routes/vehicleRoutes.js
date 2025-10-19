const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/auth');
// Add debug middleware
router.use((req, res, next) => {
  console.log(`🚗 Transport Service received: ${req.method} ${req.originalUrl}`);
  next();
});

// PUBLIC ENDPOINTS (for normal users browsing)
// Get all transportation for public browsing
router.get('/transportation', vehicleController.getAllVehicles);

// Alternative route that might be received from proxy
router.get('/api/transport/transportation', vehicleController.getAllVehicles);

// Get specific transportation by ID for public viewing
router.get('/transportation/:id', vehicleController.getVehicleById);

// Legacy public routes for backward compatibility
router.get('/vehicles/all', vehicleController.getAllVehicles);
router.get('/vehicles/:id', vehicleController.getVehicleById);

// PROVIDER ENDPOINTS (for vehicle providers - authenticated)
// Get all vehicles for authenticated user
router.get('/vehicles', verifyToken, vehicleController.getVehicles);

router.post('/vehicles', verifyToken, vehicleController.createVehicle);
router.put('/vehicles/:id', verifyToken, vehicleController.updateVehicle);
router.delete('/vehicles/:id', verifyToken, vehicleController.deleteVehicle);

// Legacy routes to maintain backward compatibility
router.get('/', verifyToken, vehicleController.getVehicles);
router.post('/addvehicles', verifyToken, vehicleController.createVehicle);
router.put('/updatevehicles/:id', verifyToken, vehicleController.updateVehicle);
router.delete('/deletevehicles/:id', verifyToken, vehicleController.deleteVehicle);

module.exports = router;