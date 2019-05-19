const likes = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    titleSlug: DataTypes.STRING,
    status: DataTypes.ENUM({
      values: ['like', 'dislike', 'neutral']
    })
  }, {});
  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Like.belongsTo(models.Article, {
      foreignKey: 'titleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Like;
};
export default likes;
