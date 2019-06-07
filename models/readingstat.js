
const readingStats = (sequelize, DataTypes) => {
  const ReadingStat = sequelize.define('ReadingStat', {
    articleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    isDuplicate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {});
  ReadingStat.associate = (models) => {
    // associations can be defined here
    ReadingStat.belongsTo(models.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
    ReadingStat.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onupdate: 'CASCADE'
    });
  };
  return ReadingStat;
};

export default readingStats;
