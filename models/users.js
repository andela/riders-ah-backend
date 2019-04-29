const users = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      bio: DataTypes.STRING,
      image: {
        type: DataTypes.STRING
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};

export default users;
