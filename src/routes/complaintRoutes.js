const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const { createComplaint, getComplaints, getComplaintById, updateComplaintResponse, updateComplaintStatus } = require('../controllers/complaintController');

// Create complaint
router.post('/complaints', verifyToken, createComplaint);

// List complaints
router.get('/complaints', getComplaints);

// Get complaint by id
router.get('/complaints/:id', getComplaintById);

// Admin: update response message
router.patch('/complaints/:id/response', verifyToken, requireAdmin, updateComplaintResponse);

// Admin: update status
router.patch('/complaints/:id/status', verifyToken, requireAdmin, updateComplaintStatus);

module.exports = router;


