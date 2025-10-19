const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 70
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleClasses: {
    type: [String],
    required: true,
    enum: ['car', 'van', 'bus', 'tuk'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one vehicle class must be selected'
    }
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTrips: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true
  },
  // Geographic coordinates of the driver's base location
  coordinates: {
    lat: { type: Number, required: false },
    lng: { type: Number, required: false }
  },
  languages: {
    type: [String],
    default: ['English', 'Sinhala']
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  profileImage: {
    type: String,
    default: '/placeholder-driver.jpg'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'drivers'
});

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver;
