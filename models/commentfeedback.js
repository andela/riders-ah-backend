const commentFeedbacks = (sequelize, DataTypes) => {
  const CommentFeedback = sequelize.define('CommentFeedback', {
    userId: DataTypes.INTEGER,
    commentId: DataTypes.INTEGER,
    feedback: DataTypes.ENUM({
      values: ['like', 'neutral']
    })
  }, {});
  CommentFeedback.associate = (models) => {
    CommentFeedback.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'liked',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
    CommentFeedback.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      as: 'like',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
  };
  return CommentFeedback;
};
export default commentFeedbacks;
