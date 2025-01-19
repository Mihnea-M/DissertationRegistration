const { Sequelize, DataTypes } = require("sequelize");
const createUser = require("./user");
const createStudent = require("./student");
const createProfessor = require("./professor");
const createRegistrationSession = require("./registrationSession");
const createRequest = require("./request");
const createFile = require("./file");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "data.db",
  logging: false,
});

const models = {};

models.User = createUser(sequelize, DataTypes);
models.Student = createStudent(sequelize, DataTypes);
models.Professor = createProfessor(sequelize, DataTypes);
models.RegistrationSession = createRegistrationSession(sequelize, DataTypes);
models.Request = createRequest(sequelize, DataTypes);
models.File = createFile(sequelize, DataTypes);

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

module.exports = models;
