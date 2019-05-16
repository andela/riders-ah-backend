const comments = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    parentid: DataTypes.INTEGER,
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
  };
  return Comment;
};
export default comments;
