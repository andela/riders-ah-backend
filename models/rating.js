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
      articleSlug: {
        type: DataTypes.STRING,
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
    Rating.belongsTo(models.User, {
      foreignKey: 'reviewerId', as: 'author', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
    Rating.belongsTo(models.Article, {
      foreignKey: 'articleSlug', targetKey: 'slug', onDelete: 'CASCADE', onUpdate: 'CASCADE'
    });
  };
  return Rating;
};

export default ratings;
