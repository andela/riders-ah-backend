const userMarks = (sequelize, DataTypes) => {
  const UserMarks = sequelize.define(
    'UserMarks',
    {
      userId: DataTypes.INTEGER,
      marks: DataTypes.INTEGER,
      roomId: DataTypes.INTEGER
    }, {}
  );
  UserMarks.associate = (models) => {
    UserMarks.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'id'
    });
    UserMarks.belongsTo(models.GameRoom, {
      foreignKey: 'roomId',
      sourceKey: 'id'
    });
  };
  return UserMarks;
};
export default userMarks;
