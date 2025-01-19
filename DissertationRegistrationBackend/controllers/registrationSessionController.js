const { User, RegistrationSession, Professor, Request } = require("../models");
const { Op } = require("sequelize");

const createRegistrationSession = async (req, res) => {
  const { professorId } = req.params;
  const {
    startDate: newStartDate,
    endDate: newEndDate,
    maxStudents,
  } = req.body;

  try {
    const professor = await Professor.findByPk(professorId);
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);
    endDate.setHours(23, 59, 59, 999); // Set end date time to 23:59

    if (startDate < startOfToday) {
      return res
        .status(400)
        .json({ message: "Cannot create sessions in the past" });
    }

    const overlappingSession = await RegistrationSession.findOne({
      where: {
        professorId: professor.userId,
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            endDate: {
              [Op.between]: [startDate, endDate],
            },
          },
          {
            [Op.and]: [
              {
                startDate: {
                  [Op.lte]: startDate,
                },
              },
              {
                endDate: {
                  [Op.gte]: endDate,
                },
              },
            ],
          },
        ],
      },
    });

    if (overlappingSession) {
      return res
        .status(400)
        .json({ message: "Overlapping registration session exists" });
    }

    const registrationSession = await RegistrationSession.create({
      professorId: professor.userId,
      startDate,
      endDate,
      maxStudents,
    });

    return res.status(201).json(registrationSession);
  } catch (error) {
    console.error("Error creating registration session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getRegistrationSessionById = async (req, res) => {
  try {
    const registrationSession = await RegistrationSession.findByPk(
      req.params.id
    );
    if (!registrationSession) {
      return res
        .status(404)
        .json({ message: "Registration session not found" });
    }
    res.json(registrationSession);
  } catch (error) {
    console.error("Error getting registration session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// returns active sessions with space for students to register
const getActiveSessions = async (req, res) => {
  try {
    const now = new Date();
    const activeSessions = await RegistrationSession.findAll({
      where: {
        [Op.and]: [
          { startDate: { [Op.lte]: now } },
          { endDate: { [Op.gte]: now } },
        ],
      },
      include: [
        {
          model: Professor,
          as: "professor",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name"],
            },
          ],
          attributes: ["department"],
        },
      ],
    });

    const sessions = activeSessions.filter((session) => {
      const approvedCount = session.requests
        ? session.requests.filter(
            (r) => r.status !== "approved" && r.status !== "rejected"
          ).length
        : 0;
      return approvedCount < session.maxStudents;
    });

    const result = sessions.map((session) => ({
      id: session.id,
      startDate: session.startDate,
      endDate: session.endDate,
      professor: {
        name: session.professor.user.name,
        department: session.professor.department,
      },
    }));

    res.json(result);
  } catch (error) {
    console.error("Error getting active registration sessions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRegistrationSession = async (req, res) => {
  try {
    const registrationSession = await RegistrationSession.findByPk(
      req.params.id
    );
    if (!registrationSession) {
      return res
        .status(404)
        .json({ message: "Registration session not found" });
    }

    await registrationSession.update(req.body);
    res.json(registrationSession);
  } catch (error) {
    console.error("Error updating registration session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRegistrationSession = async (req, res) => {
  try {
    const registrationSession = await RegistrationSession.findByPk(
      req.params.id
    );
    if (!registrationSession) {
      return res
        .status(404)
        .json({ message: "Registration session not found" });
    }

    await registrationSession.destroy();
    res.json({ message: "Registration session deleted successfully" });
  } catch (error) {
    console.error("Error deleting registration session:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRegistrationSession,
  getRegistrationSessionById,
  getActiveSessions,
  updateRegistrationSession,
  deleteRegistrationSession,
};
