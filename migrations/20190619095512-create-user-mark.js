const marksMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('UserMarks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    userId: {
      type: Sequelize.INTEGER
    },
    roomId: {
      type: Sequelize.INTEGER
    },
    marks: {
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
  down: queryInterface => queryInterface.dropTable('UserMarks')
};

export default marksMigration;
