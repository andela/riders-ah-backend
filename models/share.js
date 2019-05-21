const shares = (sequelize, DataTypes) => {
  const Share = sequelize.define('Share', {
    userId: DataTypes.INTEGER,
    titleSlug: DataTypes.STRING,
    platform: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['neutral']
    }
  }, {});
  Share.associate = (models) => {
    Share.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Share.belongsTo(models.Article, {
      foreignKey: 'titleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Share;
};
export default shares;
