const commentHistory = (sequelize, DataTypes) => {
  const CommentHistory = sequelize.define('CommentHistory', {
    parentComment: DataTypes.INTEGER,
    body: DataTypes.STRING,
  }, {});
  CommentHistory.associate = (models) => {
    // associations can be defined here
    CommentHistory.belongsTo(models.Comment, {
      foreignKey: 'parentComment',
      as: 'parent',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
  };
  return CommentHistory;
};

export default commentHistory;
