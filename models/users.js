const users = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
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
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      notificationSettings: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['receiveEmail', 'receiveInApp', 'onfollowPublish', 'onArticleFavoritedInteraction']
      },
      token: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
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
    User.hasMany(models.Share, { foreignKey: 'userId' });
    User.hasMany(models.Bookmark, { foreignKey: 'userId' });
    User.hasMany(models.CommentFeedback, { as: 'liked', foreignKey: 'userId' });
    User.hasMany(models.ReadingStat, { foreignKey: 'userId' });
    User.hasMany(models.Message, { as: 'sender', foreignKey: 'senderId' });
    User.hasMany(models.ArticleHighlight, { foreignKey: 'userId' });
    User.hasMany(models.HighlightComment, { foreignKey: 'userId' });
  };
  User.addHook('afterValidate', (user) => {
    const isTesting = process.env.NODE_ENV === 'test';
    if (isTesting) user.isVerified = isTesting;
  });
  return User;
};

export default users;
