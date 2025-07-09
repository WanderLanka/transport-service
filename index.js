require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Add this line
}));
app.use(express.json());

// Add request logging with headers
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Authorization header:', req.headers.authorization);
  next();
});

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['car', 'van', 'bus']
  },
  brand: {
    type: String,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  ac: {
    type: Boolean,
    default: true
  },
  availability: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  pricingPerKm: {
    type: Number,
    required: true
  },
  licensePlate: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
    required: true
  }
}, { 
  timestamps: true,
  collection: 'vehicle' // Explicitly set collection name to match your MongoDB
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Database connection - UPDATE TO USE 'test' DATABASE
const connectDB = async () => {
  try {
    // Change this to connect to 'test' database where your data exists
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/test';
    console.log('Connecting to MongoDB:', mongoUri);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Verifying token:', token ? 'Token provided' : 'No token');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    console.log('Token verified successfully for user:', req.user.username);
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Transport Service'
  });
});

// Get vehicles endpoint - ADD MISSING verifyToken middleware
app.get('/vehicles', verifyToken, async (req, res) => {
  try {
    console.log('Fetching vehicles for user:', req.user.username);
    
    // For testing, return all vehicles first
    // Later you can filter by userId: const vehicles = await Vehicle.find({ userId: req.user.userId });
    const vehicles = await Vehicle.find({userId:req.user.username}); // Use username if userId not available
    
    console.log('Found vehicles:', vehicles.length);
    res.status(200).json(vehicles);
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/addvehicles', verifyToken, async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      userId:req.user.username // Use username if userId not available
    };
    
    console.log('Adding vehicle for user:', vehicleData.userId);
    
    const newVehicle = new Vehicle(vehicleData);
    await newVehicle.save();
    
    console.log('Vehicle added successfully:', newVehicle);
    res.status(201).json(newVehicle);
  } catch (err) {
    console.error('Error adding vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);

app.delete('/deletevehicles/:id', verifyToken, async (req, res) => {
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
    }
);

app.put('/updatevehicles/:id', verifyToken, async (req, res) => {
  try { 
    const vehicleId = req.params.id;
    const updateData = req.body;
    console.log('Updating vehicle:', vehicleId, 'with data:', updateData);
    const updatedVehicle = await Vehicle.findByIdAndUpdate(vehicleId, updateData, { new: true });
    if (!updatedVehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    console.log('Vehicle updated successfully:', updatedVehicle);
    res.status(200).json(updatedVehicle);           
    } catch (err) {
    console.error('Error updating vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });   
    }   
});




// Create vehicle endpoint (for testing)
app.post('/transport/vehicles', verifyToken, async (req, res) => {
  try {
    const vehicleData = {
      ...req.body,
      userId: req.user.userId || req.user.username // Use username if userId not available
    };
    
    const newVehicle = new Vehicle(vehicleData);
    await newVehicle.save();
    
    console.log('Vehicle created successfully');
    res.status(201).json(newVehicle);
  } catch (err) {
    console.error('Error creating vehicle:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
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
      console.log(`   GET /transport/vehicles - Get all vehicles`);
      console.log(`   POST /transport/vehicles - Create vehicle`);
      console.log(`   DELETE /transport/vehicles/:id - Delete vehicle`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();