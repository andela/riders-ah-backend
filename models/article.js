const articles = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {});
  Article.associate = (models) => {
    Article.belongsTo(models.User, { as: 'author' });
  };
  return Article;
};
export default articles;
