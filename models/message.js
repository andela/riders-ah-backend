const messages = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    'Message',
    {
      senderId: DataTypes.INTEGER,
      message: DataTypes.TEXT
    },
    {}
  );
  Message.associate = (models) => {
    // associations can be defined here
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Message;
};
export default messages;
