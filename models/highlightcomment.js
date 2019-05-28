import dotenv from 'dotenv';

dotenv.config();
const highlightComment = (sequelize, DataTypes) => {
  const HighlightComment = sequelize.define(
    'HighlightComment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      highlightId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {}
  );
  HighlightComment.associate = (models) => {
    // associations can be defined here
    HighlightComment.belongsTo(models.User, {
      foreignKey: 'userId', as: 'author', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
    HighlightComment.belongsTo(models.ArticleHighlight, {
      foreignKey: 'highlightId', as: 'highlight', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
  };
  return HighlightComment;
};

export default highlightComment;
