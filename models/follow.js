const follow = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follows', {
    follower: DataTypes.INTEGER,
    following: DataTypes.INTEGER
  }, {});
  Follow.associate = (models) => {
    // associations can be defined here
    Follow.belongsTo(models.User, { foreignKey: 'follower' });
    Follow.belongsTo(models.User, { foreignKey: 'following' });
  };
  return Follow;
};

export default follow;
