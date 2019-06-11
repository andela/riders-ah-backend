const reportedArticle = (sequelize, DataTypes) => {
  const ReportedArticle = sequelize.define('ReportedArticle', {
    userId: DataTypes.INTEGER,
    articleSlug: DataTypes.STRING,
    reportType: {
      type: DataTypes.ENUM,
      values: ['plagiarism', 'spam', 'harassment', 'others']
    },
    reason: DataTypes.TEXT
  }, {});
  ReportedArticle.associate = (models) => {
    // associations can be defined here
    ReportedArticle.belongsTo(models.Article, {
      foreignKey: 'articleSlug',
      targetKey: 'slug',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    ReportedArticle.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return ReportedArticle;
};

export default reportedArticle;
