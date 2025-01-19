const {
  File,
  Request,
  Student,
  Professor,
  RegistrationSession,
} = require("../models");
const path = require("path");
const fs = require("fs");

const getLatestStudentFile = async (req, res) => {
  try {
    const { professorId, registrationSessionId, studentId } = req.params;
    if (!professorId || !registrationSessionId || !studentId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const files = await File.findAll({
      where: {
        uploadedBy: "student",
      },
      include: [
        {
          model: Request,
          as: "request",
          where: {
            professorId,
            registrationSessionId,
            studentId,
          },
          include: [
            { model: Student, as: "student" },
            { model: Professor, as: "professor" },
            { model: RegistrationSession, as: "registrationSession" },
          ],
        },
      ],
      order: [["dateUploaded", "DESC"]],
    });

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    const latestFile = files[0];
    const filePath = path.join(
      __dirname,
      "../uploads",
      professorId.toString(),
      registrationSessionId.toString(),
      studentId.toString(),
      latestFile.fileName
    );

    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ message: "File not found" });
    }

    const originalFileName = latestFile.fileName.split("-").slice(1).join("-");

    res.download(filePath, originalFileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error getting latest student file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfessorFile = async (req, res) => {
  try {
    const { professorId, registrationSessionId, studentId } = req.params;
    if (!professorId || !registrationSessionId || !studentId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const files = await File.findAll({
      where: {
        uploadedBy: "professor",
      },
      include: [
        {
          model: Request,
          as: "request",
          where: {
            professorId,
            registrationSessionId,
            studentId,
          },
          include: [
            { model: Student, as: "student" },
            { model: Professor, as: "professor" },
            { model: RegistrationSession, as: "registrationSession" },
          ],
        },
      ],
      order: [["dateUploaded", "DESC"]],
    });

    if (files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    const latestFile = files[0];
    const filePath = path.join(
      __dirname,
      "../uploads",
      professorId.toString(),
      registrationSessionId.toString(),
      studentId.toString(),
      latestFile.fileName
    );

    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ message: "File not found" });
    }

    const originalFileName = latestFile.fileName.split("-").slice(1).join("-");

    res.download(filePath, originalFileName, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Error getting professor file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      professorId,
      registrationSessionId,
      studentId,
      uploadedBy,
      fileType,
    } = req.query;

    if (!professorId || !registrationSessionId || !studentId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    // Save the file information in the database
    const file = await File.create({
      requestId: id,
      fileName: req.file.filename,
      uploadedBy,
      fileType,
    });

    // Update the request status
    const request = await Request.findByPk(id);
    const newStatus =
      uploadedBy === "professor" ? "completed" : `${uploadedBy}FileUploaded`;
    await request.update({ status: newStatus });

    return res.json({ request, file });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const rejectFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { justification } = req.body;
    const file = await File.findByPk(id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const request = await Request.findByPk(file.requestId);
    await request.update({
      status: "fileRejectedByProfessor",
      justification: justification || null,
    });

    return res.json(file);
  } catch (error) {
    console.error("Error rejecting file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getLatestStudentFile,
  getProfessorFile,
  uploadFile,
  rejectFile,
};
