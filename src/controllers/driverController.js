const Driver = require('../models/Driver');

// Get all drivers for the authenticated user
const getDrivers = async (req, res) => {
  try {
    console.log('Fetching drivers for user:', req.user.username);
    
    const drivers = await Driver.find({ userId: req.user.username });
    
    console.log('Found drivers:', drivers.length);
    res.status(200).json(drivers);
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get driver by ID
const getDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await Driver.findById(driverId);
    
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    console.log('Found driver:', driver.name);
    res.status(200).json(driver);
  } catch (err) {
    console.error('Error fetching driver:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add new driver
const addDriver = async (req, res) => {
  try {
    const driverData = {
      ...req.body,
      userId: req.user.username
    };

    // Normalize coordinates if provided as strings
    if (driverData.coordinates) {
      const { lat, lng } = driverData.coordinates;
      driverData.coordinates = {
        lat: typeof lat === 'string' ? parseFloat(lat) : lat,
        lng: typeof lng === 'string' ? parseFloat(lng) : lng
      };
    }

    // Normalize numeric fields
    if (driverData.age) {
      driverData.age = typeof driverData.age === 'string' ? parseInt(driverData.age) : driverData.age;
    }
    if (driverData.experience) {
      driverData.experience = typeof driverData.experience === 'string' ? parseInt(driverData.experience) : driverData.experience;
    }
    if (driverData.totalTrips) {
      driverData.totalTrips = typeof driverData.totalTrips === 'string' ? parseInt(driverData.totalTrips) : driverData.totalTrips;
    }
    if (driverData.rating) {
      driverData.rating = typeof driverData.rating === 'string' ? parseFloat(driverData.rating) : driverData.rating;
    }
    
    console.log('Adding driver for user:', driverData.userId);
    
    const newDriver = new Driver(driverData);
    await newDriver.save();
    
    console.log('Driver added successfully:', newDriver);
    res.status(201).json(newDriver);
  } catch (err) {
    console.error('Error adding driver:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ 
        error: `${field === 'email' ? 'Email' : field === 'licenseNumber' ? 'License number' : field} already exists` 
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updateData = req.body;
    
    // Normalize coordinates if provided as strings
    if (updateData.coordinates) {
      const { lat, lng } = updateData.coordinates;
      updateData.coordinates = {
        lat: typeof lat === 'string' ? parseFloat(lat) : lat,
        lng: typeof lng === 'string' ? parseFloat(lng) : lng
      };
    }

    // Normalize numeric fields
    if (updateData.age) {
      updateData.age = typeof updateData.age === 'string' ? parseInt(updateData.age) : updateData.age;
    }
    if (updateData.experience) {
      updateData.experience = typeof updateData.experience === 'string' ? parseInt(updateData.experience) : updateData.experience;
    }
    if (updateData.totalTrips) {
      updateData.totalTrips = typeof updateData.totalTrips === 'string' ? parseInt(updateData.totalTrips) : updateData.totalTrips;
    }
    if (updateData.rating) {
      updateData.rating = typeof updateData.rating === 'string' ? parseFloat(updateData.rating) : updateData.rating;
    }
    
    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, { new: true });
    
    if (!updatedDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    console.log('Driver updated successfully:', updatedDriver);
    res.status(200).json(updatedDriver);
  } catch (err) {
    console.error('Error updating driver:', err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      res.status(400).json({ 
        error: `${field === 'email' ? 'Email' : field === 'licenseNumber' ? 'License number' : field} already exists` 
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const deletedDriver = await Driver.findByIdAndDelete(driverId);
    
    if (!deletedDriver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    
    console.log('Driver deleted successfully:', deletedDriver.name);
    res.status(200).json({ message: 'Driver deleted successfully', driver: deletedDriver });
  } catch (err) {
    console.error('Error deleting driver:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUBLIC ENDPOINTS - for normal users browsing drivers

// Get all drivers for public browsing (no authentication required)
const getAllDriversPublic = async (req, res) => {
  try {
    console.log('Fetching all drivers for public listing');
    
    // Get all active drivers without user filtering for public display
    const drivers = await Driver.find({ status: 'active' });
    
    console.log('Found drivers:', drivers.length);
    res.status(200).json({ 
      success: true,
      data: drivers,
      count: drivers.length 
    });
  } catch (err) {
    console.error('Error fetching drivers:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch drivers'
    });
  }
};

// Get driver by ID for public viewing (no authentication required)
const getDriverByIdPublic = async (req, res) => {
  try {
    const driverId = req.params.id;
    console.log('Fetching driver by ID:', driverId);
    
    const driver = await Driver.findById(driverId);
    
    if (!driver) {
      return res.status(404).json({ 
        success: false,
        error: 'Driver not found' 
      });
    }
    
    console.log('Found driver:', driver.name);
    res.status(200).json({ 
      success: true,
      data: driver 
    });
  } catch (err) {
    console.error('Error fetching driver:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to fetch driver'
    });
  }
};

module.exports = {
  getDrivers,
  getDriverById,
  addDriver,
  updateDriver,
  deleteDriver,
  getAllDriversPublic,
  getDriverByIdPublic
};
