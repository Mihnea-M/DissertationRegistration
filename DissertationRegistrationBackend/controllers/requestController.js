const {
  Request,
  RegistrationSession,
  Student,
  Professor,
  File,
  User,
} = require("../models");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { professorId, registrationSessionId, studentId } = req.body;
    const dir = path.join(
      "uploads",
      professorId,
      registrationSessionId,
      studentId
    );
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

async function getStudentRequests(req, res) {
  try {
    const { studentId } = req.params;
    const requests = await Request.findAll({
      where: { studentId },
      include: [
        { model: Student, as: "student" },
        {
          model: Professor,
          as: "professor",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
        { model: RegistrationSession, as: "registrationSession" },
        { model: File, as: "files" },
      ],
    });

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      status: request.status,
      justification: request.justification,
      professor: {
        name: request.professor.user.name,
        department: request.professor.department,
      },
      professorId: request.professorId,
      registrationSessionId: request.registrationSessionId,
      studentId: request.studentId,
      registrationSession: {
        startDate: request.registrationSession.startDate,
        endDate: request.registrationSession.endDate,
      },
      files: request.files.map((file) => ({
        ...file.toJSON(),
        fileName: file.fileName.split("-").slice(1).join("-"), // Remove prefix from file name
      })),
    }));

    return res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching student requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get all requests of a professor
async function getProfessorRequests(req, res) {
  try {
    const { professorId } = req.params;
    const requests = await Request.findAll({
      where: { professorId },
      include: [
        {
          model: Student,
          as: "student",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
        { model: RegistrationSession, as: "registrationSession" },
        { model: File, as: "files" },
      ],
    });

    const formattedRequests = requests.map((request) => ({
      id: request.id,
      status: request.status,
      justification: request.justification,
      student: {
        name: request.student.user.name,
      },
      professorId: request.professorId,
      registrationSessionId: request.registrationSessionId,
      studentId: request.studentId,
      registrationSession: {
        startDate: request.registrationSession.startDate,
        endDate: request.registrationSession.endDate,
      },
      files: request.files.map((file) => ({
        ...file.toJSON(),
        fileName: file.fileName.split("-").slice(1).join("-"), // Remove prefix from file name
      })),
    }));

    return res.json(formattedRequests);
  } catch (error) {
    console.error("Error fetching professor requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createRequest(req, res) {
  try {
    const { studentId, registrationSessionId, justification } = req.body;

    const session = await RegistrationSession.findByPk(registrationSessionId);
    if (!session) {
      return res
        .status(404)
        .json({ message: "Registration session not found" });
    }
    const professorId = session.professorId;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const professor = await Professor.findByPk(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    const newRequest = await Request.create({
      studentId,
      professorId,
      registrationSessionId,
      justification,
      status: "pending",
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function approveRequest(req, res) {
  try {
    const { id } = req.params;

    const request = await Request.findByPk(id, {
      include: [
        { model: Student, as: "student" },
        {
          model: Professor,
          as: "professor",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
      ],
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if already approved by someone else
    const alreadyApproved = await Request.findOne({
      where: {
        studentId: request.studentId,
        status: {
          [Op.in]: [
            "approved",
            "studentFileUploaded",
            "fileRejectedByProfessor",
            "completed",
          ],
        },
      },
    });
    if (alreadyApproved && alreadyApproved.id !== request.id) {
      return res.status(400).json({
        message: "Student already has an approved request",
      });
    }

    // Check capacity for this registration session
    const session = await RegistrationSession.findByPk(
      request.registrationSessionId,
      {
        include: [{ model: Request, as: "requests" }],
      }
    );
    const approvedCount = session.requests.filter((r) =>
      [
        "approved",
        "studentFileUploaded",
        "fileRejectedByProfessor",
        "completed",
      ].includes(r.status)
    ).length;

    if (approvedCount >= session.maxStudents) {
      return res.status(400).json({
        message: "Session is at full capacity",
      });
    }

    // Approve the request
    await request.update({ status: "approved" });

    // Reject other pending requests
    const pendingRequests = await Request.findAll({
      where: {
        studentId: request.studentId,
        status: "pending",
        id: {
          [Op.not]: request.id,
        },
      },
    });

    for (const pendingRequest of pendingRequests) {
      await pendingRequest.update({
        status: "rejected",
        justification: `Another request was accepted by Professor ${request.professor.user.name}`,
      });
    }

    return res.json(request);
  } catch (error) {
    console.error("Error approving request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function rejectRequest(req, res) {
  try {
    const { id } = req.params;
    const { justification } = req.body;
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    await request.update({
      status: "rejected",
      justification: justification || null,
    });
    return res.json(request);
  } catch (error) {
    console.error("Error rejecting request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Mark request as studentFileUploaded
async function studentFileUpload(req, res) {
  try {
    const { id } = req.params;
    const request = await Request.findByPk(id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (!["approved", "fileRejectedByProfessor"].includes(request.status)) {
      return res.status(400).json({
        message: "You cannot upload files in the current request status",
      });
    }

    // Save the file information in the database
    const file = await File.create({
      requestId: id,
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: "student",
      fileType: "student_request",
    });

    // Update the request status
    await request.update({ status: "studentFileUploaded" });

    return res.json({ request, file });
  } catch (error) {
    console.error("Error uploading student file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getStudentRequests,
  getProfessorRequests,
  createRequest,
  approveRequest,
  rejectRequest,
  studentFileUpload,
};
