const gameRooms = (sequelize, DataTypes) => {
  const GameRoom = sequelize.define(
    'GameRoom',
    {
      name: DataTypes.STRING,
      emails: DataTypes.ARRAY(DataTypes.STRING),
      joined: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      userId: DataTypes.INTEGER
    }, {}
  );
  GameRoom.associate = (models) => {
    GameRoom.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    GameRoom.hasMany(models.UserMarks, { foreignKey: 'roomId' });
  };
  return GameRoom;
};
export default gameRooms;
