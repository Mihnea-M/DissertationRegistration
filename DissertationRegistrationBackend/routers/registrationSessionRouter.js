const express = require('express');
const { getRegistrationSessionById, updateRegistrationSession, deleteRegistrationSession, getActiveSessions } = require('../controllers/registrationSessionController');
const { authenticateProfessor, authenticateProfessorOrStudent } = require('../middleware/authMiddleware');
const { preventOldOrOngoingSessionModification, preventPastDatesModification, validateStartEndDate } = require('../middleware/registrationSessionMiddleware');

const router = express.Router();

router.get('/active', authenticateProfessorOrStudent, getActiveSessions);
router.get('/:id', authenticateProfessorOrStudent, getRegistrationSessionById);
router.put('/:id', authenticateProfessor, preventOldOrOngoingSessionModification, preventPastDatesModification, validateStartEndDate, updateRegistrationSession);
router.delete('/:id', authenticateProfessor, preventOldOrOngoingSessionModification, deleteRegistrationSession);

module.exports = router;