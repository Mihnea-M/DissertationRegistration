const { Professor, RegistrationSession, User, Student, Request } = require("../models");
const { Op } = require('sequelize');

const listProfessors = async (req, res) => {
  try {
    const professors = await Professor.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "department"],
      },
    });
    res.json(professors);
  } catch (error) {
    console.error("Error listing professors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfessorById = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id, {
      include: {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "department"],
      },
    });
    if (!professor) {
      return res.status(404).json({ message: "Professor not found" });
    }
    res.json(professor);
  } catch (error) {
    console.error("Error getting professor:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProfessorRegistrationSessions = async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.id, {
      include: {
        model: RegistrationSession,
        as: 'registrationSessions'
      }
    });

    if (!professor) {
      return res.status(404).json({ message: 'Professor not found' });
    }

    const registrationSessions = await Promise.all(professor.registrationSessions.map(async session => {
      const requestCount = await Request.count({
        where: {
          registrationSessionId: session.id,
          status: {
            [Op.notIn]: ['pending', 'rejected']
          }
        }
      });
      return {
        ...session.toJSON(),
        requestCount
      };
    }));

    res.json(registrationSessions);
  } catch (error) {
    console.error('Error getting professor registration sessions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  listProfessors,
  getProfessorById,
  getProfessorRegistrationSessions,
};
