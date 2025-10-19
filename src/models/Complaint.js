const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema(
  {
    providerType: { type: String, enum: ['transport', 'accommodation'], required: true },
    topic: { type: String, required: true }, // maps to 'subject' field from UI
    category: { type: String, default: 'transport' },
    complaint: { type: String, required: true }, // detailed description
    userEmail: { type: String },
    userName: { type: String },
    submittedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['new', 'investigating', 'resolved', 'closed'], default: 'new' },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    photos: [
      {
        id: { type: Number },
        url: { type: String },
        caption: { type: String }
      }
    ],
    serviceProvider: { type: String },
    bookingReference: { type: String },
    responseRequired: { type: Boolean, default: false },
    response: { type: String },
    createdBy: { type: String },
  },
  {
    timestamps: true,
    collection: 'complaints'
  }
);

module.exports = mongoose.model('Complaint', ComplaintSchema);


