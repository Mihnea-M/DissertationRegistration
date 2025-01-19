const createRequest = (sequelize, DataTypes) => {
  const Request = sequelize.define(
    "Request",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "userId",
        },
      },
      professorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "professors",
          key: "userId",
        },
      },
      registrationSessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "registration_sessions",
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM(
          "pending",
          "approved",
          "rejected",
          "studentFileUploaded",
          "fileRejectedByProfessor",
          "completed",
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      justification: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "requests",
      timestamps: false,
    }
  );

  Request.associate = (models) => {
    Request.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });

    Request.belongsTo(models.Professor, {
      foreignKey: "professorId",
      as: "professor",
    });

    Request.belongsTo(models.RegistrationSession, {
      foreignKey: "registrationSessionId",
      as: "registrationSession",
    });

    Request.hasMany(models.File, {
      foreignKey: "requestId",
      as: "files",
    });
  };

  return Request;
};

module.exports = createRequest;
