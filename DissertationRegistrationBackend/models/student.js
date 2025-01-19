const createStudent = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      studentNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "students",
      timestamps: false,
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Student.hasMany(models.Request, {
      foreignKey: "studentId",
      as: "requests",
    });
  };

  return Student;
};

module.exports = createStudent;
