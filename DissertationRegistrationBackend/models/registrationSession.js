const createRegistrationSession = (sequelize, DataTypes) => {
  const RegistrationSession = sequelize.define(
    "RegistrationSession",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      professorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "professors",
          key: "userId",
        },
      },
      maxStudents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      tableName: "registration_sessions",
      timestamps: false,
    }
  );

  RegistrationSession.associate = (models) => {
    RegistrationSession.belongsTo(models.Professor, {
      foreignKey: "professorId",
      as: "professor",
    });

    RegistrationSession.hasMany(models.Request, {
      foreignKey: "registrationSessionId",
      as: "requests",
    });
  };

  return RegistrationSession;
};

module.exports = createRegistrationSession;
