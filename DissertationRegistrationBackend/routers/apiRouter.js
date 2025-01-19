const express = require('express');
const authRouter = require('./authRouter');
const studentRouter = require('./studentRouter');
const professorRouter = require('./professorRouter');
const registrationSessionRouter = require('./registrationSessionRouter');
const requestRouter = require('./requestRouter');
const fileRouter = require('./fileRouter');

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/students', studentRouter);
apiRouter.use('/professors', professorRouter);
apiRouter.use('/registration-sessions', registrationSessionRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/files', fileRouter)

module.exports = apiRouter;