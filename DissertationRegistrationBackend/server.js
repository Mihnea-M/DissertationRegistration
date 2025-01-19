require("dotenv").config();
const express = require('express');
const cookieparser =  require('cookie-parser');
const cors = require('cors');
const path = require('path');

const { sequelize, User } = require('./models');
const apiRouter = require('./routers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieparser());

if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:1234', credentials: true }));
}

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, '../DissertationRegistrationClient/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../DissertationRegistrationClient/dist/index.html'));
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});