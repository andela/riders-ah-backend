const droppedTokens = (sequelize, DataTypes) => {
  const DroppedTokens = sequelize.define(
    'DroppedTokens',
    {
      token: DataTypes.TEXT,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {}
  );
  DroppedTokens.associate = () => {
    // associations can be defined here
  };
  return DroppedTokens;
};
export default droppedTokens;
