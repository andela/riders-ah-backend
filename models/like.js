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
      onupdate: 'CASCADE'
    });
    Like.belongsTo(models.Article, {
      foreignKey: 'titleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
  };
  return Like;
};
export default likes;
