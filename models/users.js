const users = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roles: {
        type: DataTypes.JSON('user', 'admin', 'super_user'),
        defaultValue: 'user'
      }
    },
    {}
  );
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Rating, { foreignKey: 'reviewerId', allowNull: false });
    User.hasMany(models.Article, { as: 'author', foreignKey: 'authorId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Like, { foreignKey: 'userId' });
  };
  return User;
};

export default users;
