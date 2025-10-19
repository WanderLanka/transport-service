const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { verifyToken } = require('../middleware/auth');

// Vehicle routes
router.get('/vehicles', verifyToken, vehicleController.getVehicles);
router.get('/vehicles/all', vehicleController.getAllVehicles); // Public route for all vehicles
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.post('/vehicles', verifyToken, vehicleController.createVehicle);
router.put('/vehicles/:id', verifyToken, vehicleController.updateVehicle);
router.delete('/vehicles/:id', verifyToken, vehicleController.deleteVehicle);

// Legacy routes to maintain backward compatibility
router.get('/', verifyToken, vehicleController.getVehicles);
router.post('/addvehicles', verifyToken, vehicleController.createVehicle);
router.put('/updatevehicles/:id', verifyToken, vehicleController.updateVehicle);
router.delete('/deletevehicles/:id', verifyToken, vehicleController.deleteVehicle);

module.exports = router;