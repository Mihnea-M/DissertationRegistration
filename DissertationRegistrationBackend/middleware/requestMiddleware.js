const { Request } = require('../models');
const { Op } = require('sequelize');

const preventDuplicateRequest = async (req, res, next) => {
  try {
    const { studentId, registrationSessionId } = req.body;

    const existingRequest = await Request.findOne({
      where: {
        studentId,
        registrationSessionId,
        status: {
          [Op.not]: 'rejected',
        },
      },
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'A request already exists for this professor' });
    }

    next();
  } catch (error) {
    console.error('Error checking existing requests:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const preventAcceptingAnotherRequest = async (req, res, next) => {
  try {
    const { id:studentId } = req.params;
    const ongoingRequest = await Request.findOne({
      where: {
        studentId,
        status: {
          [Op.notIn]: ['rejected', 'pending'],
        },
      },
    });

    if (ongoingRequest) {
      return res.status(400).json({ message: 'Student already has an apppoved request' });
    }

    next();
  } catch (error) {
    console.error('Error checking ongoing requests:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { preventDuplicateRequest, preventAcceptingAnotherRequest };