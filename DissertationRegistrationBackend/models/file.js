const createFile = (sequelize, DataTypes) => {
  const File = sequelize.define(
    "File",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      requestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "requests",
          key: "id",
        },
      },
      uploadedBy: {
        type: DataTypes.ENUM("student", "professor"),
        allowNull: false,
      },
      fileType: {
        type: DataTypes.ENUM("student_request", "professor_response"),
        allowNull: false,
      },
      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateUploaded: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "files",
      timestamps: false,
    }
  );

  File.associate = (models) => {
    File.belongsTo(models.Request, {
      foreignKey: "requestId",
      as: "request",
    });
  };

  return File;
};

module.exports = createFile;