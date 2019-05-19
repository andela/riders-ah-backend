const bookmarks = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    titleSlug: {
      type: DataTypes.STRING,
      primaryKey: true,
    }
  }, {});
  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Bookmark.belongsTo(models.Article, {
      foreignKey: 'titleSlug',
      as: 'article',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Bookmark;
};
export default bookmarks;
