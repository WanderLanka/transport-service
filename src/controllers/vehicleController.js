const Vehicle = require('../models/Vehicle');

// Get all vehicles for a user
exports.getVehicles = async (req, res) => {
  try {
    console.log('Fetching vehicles for user:', req.user.username);
    
    const vehicles = await Vehicle.find({ userId: req.user.username });
    
    console.log('Found vehicles:', vehicles.length);
    res.status(200).json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all vehicles (for admin or public listing)
exports.getAllVehicles = async (req, res) => {
  try {
    console.log('Fetching all vehicles');
    
    const vehicles = await Vehicle.find({ availability: 'available' });
    
    console.log('Found vehicles:', vehicles.length);
    res.status(200).json({ 
      success: true,
      data: vehicles,
      count: vehicles.length 
    });
  } catch (err) {
    console.error('Error fetching all vehicles:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch vehicles'
    });
  }
};

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      userId: req.user.username
    };
    
    console.log('Adding vehicle for user:', vehicleData.userId);
    
    const newVehicle = new Vehicle(vehicleData);
    await newVehicle.save();
    
    console.log('Vehicle added successfully:', newVehicle);
    res.status(201).json(newVehicle);
  } catch (err) {
    console.error('Error adding vehicle:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }
    
    // Handle duplicate key error (license plate)
    if (err.code === 11000) {
      return res.status(400).json({ error: 'License plate already exists' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    const updateData = req.body;
    
    console.log('Updating vehicle:', vehicleId, 'with data:', updateData);
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    console.log('Vehicle updated successfully:', updatedVehicle);
    res.status(200).json(updatedVehicle);
  } catch (err) {
    console.error('Error updating vehicle:', err);
    
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    
    console.log('Deleting vehicle:', vehicleId);
    
    const deletedVehicle = await Vehicle.findByIdAndDelete(vehicleId);
    
    if (!deletedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    console.log('Vehicle deleted successfully');
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Error deleting vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicleId = req.params.id;
    
    console.log('Fetching vehicle:', vehicleId);
    
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return res.status(404).json({ 
        success: false,
        error: 'Vehicle not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      data: vehicle 
    });
  } catch (err) {
    console.error('Error fetching vehicle:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch vehicle'
    });

  }
};