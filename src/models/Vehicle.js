const mongoose = require('mongoose');

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
  model: {
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
  },
  driverName: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  driverLicense: {
    type: String,
    required: true
  },
  insuranceNumber: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  features: [{
    type: String
  }],
  images: [{
    type: String // URLs for vehicle images
  }],
  location: {
    type: String,
    required: true
  }
}, { 
  timestamps: true,
  collection: 'vehicle'
});

module.exports = mongoose.model('Vehicle', vehicleSchema);