const GamesMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('GameRooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING
    },
    emails: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    joined: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    userId: {
      type: Sequelize.INTEGER
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
  down: queryInterface => queryInterface.dropTable('GameRooms')
};
export default GamesMigration;
