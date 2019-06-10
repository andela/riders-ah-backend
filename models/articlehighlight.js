import dotenv from 'dotenv';

dotenv.config();
const articleHighlight = (sequelize, DataTypes) => {
  const ArticleHighlight = sequelize.define(
    'ArticleHighlight',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      articleSlug: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      endIndex: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      highlightedText: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  ArticleHighlight.associate = (models) => {
    // associations can be defined here
    ArticleHighlight.belongsTo(models.User, {
      foreignKey: 'userId', as: 'author', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
    ArticleHighlight.belongsTo(models.Article, {
      foreignKey: 'articleSlug', targetKey: 'slug', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
    ArticleHighlight.hasMany(models.HighlightComment, { foreignKey: 'highlightId' });
  };
  return ArticleHighlight;
};

export default articleHighlight;
