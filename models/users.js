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
      },
      notification: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['email', 'in-app', 'follower', 'articleFavorite']
      }
    },
    {}
  );
  User.associate = (models) => {
    // associations can be defined here
    User.hasMany(models.Follows, { foreignKey: 'following' });
    User.hasMany(models.Follows, { foreignKey: 'follower' });
    User.hasMany(models.Rating, { foreignKey: 'reviewerId', allowNull: false });
    User.hasMany(models.Article, { as: 'author', foreignKey: 'authorId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.Like, { foreignKey: 'userId' });
    User.hasMany(models.Follows, { foreignKey: 'following' });
    User.hasMany(models.Follows, { foreignKey: 'follower' });
    User.hasMany(models.Notification, { as: 'user', foreignKey: 'userId' });
  };
  return User;
};

export default users;
