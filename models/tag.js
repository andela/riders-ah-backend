const tags = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Tag.associate = (models) => {
    Tag.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
  };
  return Tag;
};

export default tags;
