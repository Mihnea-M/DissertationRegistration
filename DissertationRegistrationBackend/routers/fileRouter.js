const express = require("express");
const {
  authenticateProfessorOrStudent,
  authenticateProfessor,
} = require("../middleware/authMiddleware");
const { getLatestStudentFile, getProfessorFile, uploadFile, rejectFile } = require("../controllers/fileController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { professorId, registrationSessionId, studentId } = req.query;
    if (!professorId || !registrationSessionId || !studentId) {
      return cb(new Error("Missing required parameters"));
    }
    const dir = path.join(
      uploadDir,
      professorId.toString(),
      registrationSessionId.toString(),
      studentId.toString()
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Upload a file
router.put("/:id/upload", authenticateProfessorOrStudent, upload.single("file"), uploadFile);

// Download the latest student file
router.get("/student/:professorId/:registrationSessionId/:studentId", authenticateProfessorOrStudent, getLatestStudentFile);

// Download the professor file
router.get("/professor/:professorId/:registrationSessionId/:studentId", authenticateProfessorOrStudent, getProfessorFile);

// Reject a file
router.put("/:id/reject", authenticateProfessor, rejectFile);

module.exports = router;