const express = require('express');
const { authenticateStudent } = require('../middleware/authMiddleware');
const { createRequest, getStudentRequests } = require('../controllers/requestController');
const { preventDuplicateRequest } = require('../middleware/requestMiddleware');

const router = express.Router();

// Student creates a request
router.post('/requests', authenticateStudent, preventDuplicateRequest, createRequest);

// Get all requests of a student
router.get('/:studentId/requests', authenticateStudent, getStudentRequests);

module.exports = router;