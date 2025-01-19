const { RegistrationSession } = require('../models');

const preventOldOrOngoingSessionModification = async (req, res, next) => {
  try {
    const registrationSession = await RegistrationSession.findByPk(req.params.id);
    if (!registrationSession) {
      return res.status(404).json({ message: 'Registration session not found' });
    }

    const now = new Date();
    const sessionStart = new Date(registrationSession.startDate);
    const sessionEnd = new Date(registrationSession.endDate);
    
    if (sessionStart <= now) {
      return res.status(400).json({ message: 'Cannot modify old or ongoing sessions' });
    }

    next();
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const preventPastDatesModification = (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const now = new Date();
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (newStartDate < now || newEndDate < now) {
      return res.status(400).json({ message: 'Cannot set dates in the past' });
    }

    next();
  } catch (error) {
    console.error('Error checking dates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const validateStartEndDate = (req, res, next) => {
  try {
    const { startDate, endDate } = req.body;
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(endDate);

    if (newStartDate > newEndDate) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }

    next();
  } catch (error) {
    console.error('Error validating dates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { preventOldOrOngoingSessionModification, preventPastDatesModification, validateStartEndDate };