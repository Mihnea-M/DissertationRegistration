const createUser = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("student", "professor"),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Student, {
      foreignKey: "userId",
      as: "student",
    });

    User.hasOne(models.Professor, {
      foreignKey: "userId",
      as: "professor",
    });
  };

  return User;
};

module.exports = createUser;
