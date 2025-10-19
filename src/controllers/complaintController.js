const Complaint = require('../models/Complaint');

const createComplaint = async (req, res) => {
  try {
    const payload = {
      providerType: 'transport',
      topic: req.body.topic || req.body.subject,
      category: req.body.category || 'transport',
      complaint: req.body.complaint || req.body.description,
      userEmail: req.body.userEmail,
      userName: req.body.userName,
      submittedDate: req.body.submittedDate ? new Date(req.body.submittedDate) : new Date(),
      status: req.body.status || 'new',
      priority: req.body.priority || 'medium',
      photos: Array.isArray(req.body.photos) ? req.body.photos : [],
      serviceProvider: req.body.serviceProvider,
      bookingReference: req.body.bookingReference,
      responseRequired: Boolean(req.body.responseRequired),
      response: Boolean(req.body.responseRequired) ? '' : undefined,
      createdBy: req.user?.id || req.user?.username || undefined,
    };

    const doc = await Complaint.create(payload);
    return res.status(201).json({ success: true, data: doc });
  } catch (error) {
    console.error('Failed to create transport complaint:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create complaint' });
  }
};

// List all transport complaints
const getComplaints = async (req, res) => {
  try {
    const docs = await Complaint.find({ providerType: 'transport' }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: docs });
  } catch (error) {
    console.error('Failed to fetch transport complaints:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch complaints' });
  }
};

// Get a single transport complaint by id
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Complaint.findOne({ _id: id, providerType: 'transport' });
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Complaint not found' });
    }
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('Failed to fetch transport complaint by id:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch complaint' });
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById };

// Admin can update response message when responseRequired is true
const updateComplaintResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    if (typeof response !== 'string') {
      return res.status(400).json({ success: false, error: 'response must be a string' });
    }
    const doc = await Complaint.findOne({ _id: id, providerType: 'transport' });
    if (!doc) return res.status(404).json({ success: false, error: 'Complaint not found' });
    if (!doc.responseRequired) {
      return res.status(400).json({ success: false, error: 'Response not required for this complaint' });
    }
    doc.response = response;
    doc.status = doc.status === 'new' ? 'investigating' : doc.status;
    await doc.save();
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('Failed to update transport complaint response:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update response' });
  }
};

module.exports.updateComplaintResponse = updateComplaintResponse;

// Admin can update complaint status
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['new', 'investigating', 'resolved', 'closed'];
    if (typeof status !== 'string' || !allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }
    const doc = await Complaint.findOne({ _id: id, providerType: 'transport' });
    if (!doc) return res.status(404).json({ success: false, error: 'Complaint not found' });
    doc.status = status;
    await doc.save();
    return res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('Failed to update transport complaint status:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to update status' });
  }
};

module.exports.updateComplaintStatus = updateComplaintStatus;


