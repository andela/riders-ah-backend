const usersMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    bio: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};

export default usersMigration;
