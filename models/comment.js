const comments = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    replyid: DataTypes.INTEGER,
    userId: {
      type: DataTypes.INTEGER,
    },
    titleSlug: {
      type: DataTypes.STRING,
    },
    body: DataTypes.STRING
  }, {});
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comment.belongsTo(models.Article, {
      foreignKey: 'titleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comment.hasMany(models.Comment, { foreignKey: 'replyid' });
    Comment.hasMany(models.CommentFeedback, { as: 'like', foreignKey: 'commentId' });
    Comment.hasMany(models.CommentHistory, { as: 'parent', foreignKey: 'parentComment' });
  };
  return Comment;
};
export default comments;
