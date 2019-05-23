const usersMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    roles: {
      type: Sequelize.JSON('user', 'admin', 'super_admin'),
      defaultValue: 'user'
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    notification: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: ['email', 'in-app', 'follower', 'articleFavorite']
    },
    token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    createdAt: {
      type: Sequelize.DATE
    },
    updatedAt: {
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};

export default usersMigration;
