import dotenv from 'dotenv';

dotenv.config();
const ratings = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      reviewerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Rating.associate = (models) => {
    // associations can be defined here
    Rating.belongsTo(models.User, { foreignKey: 'reviewerId', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Rating.belongsTo(models.Article, { foreignKey: 'articleId', onUpdate: 'CASCADE' });
  };
  return Rating;
};

export default ratings;
