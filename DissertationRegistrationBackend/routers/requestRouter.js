const express = require('express');
const { authenticateProfessorOrStudent, authenticateStudent, authenticateProfessor } = require('../middleware/authMiddleware');
const { getActiveSessions } = require('../controllers/registrationSessionController');
const { createRequest, getStudentRequests, getProfessorRequests, approveRequest, rejectRequest } = require('../controllers/requestController');
const { preventDuplicateRequest, preventAcceptingAnotherRequest } = require('../middleware/requestMiddleware');

const router = express.Router();

// Get active registration sessions
router.get('/active-sessions', authenticateProfessorOrStudent, getActiveSessions);

// Create a request
router.post('/', authenticateStudent, preventDuplicateRequest, createRequest);

// Get all requests of a student
router.get('/students/:studentId', authenticateStudent, getStudentRequests);

// Get all requests of a professor
router.get('/professors/:professorId', authenticateProfessor, getProfessorRequests);

// Approve a request
router.put('/:id/approve', authenticateProfessor, preventAcceptingAnotherRequest, approveRequest);

// Reject a request
router.put('/:id/reject', authenticateProfessor, rejectRequest);

module.exports = router;