const articles = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: DataTypes.STRING,
      body: DataTypes.TEXT,
      description: DataTypes.STRING,
      readingTime: DataTypes.STRING,
      image: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true
      }
    },
    {}
  );
  Article.associate = (models) => {
    Article.belongsTo(models.User, { as: 'author' });
    Article.hasMany(models.Rating, { foreignKey: 'articleSlug', allowNull: false });
    Article.hasMany(models.Like, {
      foreignKey: 'titleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'titleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Tag, {
      foreignKey: 'articleId',
      as: 'tagList'
    });
    Article.hasMany(models.Rating, {
      foreignKey: 'articleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Share, {
      foreignKey: 'titleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.Bookmark, {
      foreignKey: 'titleSlug',
      sourceKey: 'slug'
    });
    Article.hasMany(models.ReadingStat, {
      foreignKey: 'articleId',
      sourceKey: 'id'
    });
  };
  return Article;
};
export default articles;
