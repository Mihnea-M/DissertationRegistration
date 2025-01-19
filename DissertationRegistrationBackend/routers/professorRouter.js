const express = require("express");
const { authenticateProfessor } = require("../middleware/authMiddleware");
const { getProfessorRequests, approveRequest, rejectRequest } = require("../controllers/requestController");
const { listProfessors, getProfessorById, getProfessorRegistrationSessions } = require("../controllers/professorController");
const { createRegistrationSession } = require("../controllers/registrationSessionController");
const { preventAcceptingAnotherRequest } = require("../middleware/requestMiddleware");

const router = express.Router();

router.get("/", authenticateProfessor, listProfessors);
router.get("/:id", authenticateProfessor, getProfessorById);
router.get("/:id/registration-sessions", authenticateProfessor, getProfessorRegistrationSessions);
router.post("/:professorId/registration-sessions", authenticateProfessor, createRegistrationSession);

router.get("/:professorId/requests", authenticateProfessor, getProfessorRequests);
router.put("/requests/:id/approve", authenticateProfessor, preventAcceptingAnotherRequest, approveRequest);
router.put("/requests/:id/reject", authenticateProfessor, rejectRequest);

module.exports = router;
