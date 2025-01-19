const createProfessor = (sequelize, DataTypes) => {
  const Professor = sequelize.define(
    'Professor',
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'professors',
      timestamps: false,
    }
  );

  Professor.associate = (models) => {
    Professor.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Professor.hasMany(models.RegistrationSession, {
      foreignKey: 'professorId',
      as: 'registrationSessions',
    });

    Professor.hasMany(models.Request, {
      foreignKey: 'professorId',
      as: 'requests',
    });
  };

  return Professor;
};

module.exports = createProfessor;
