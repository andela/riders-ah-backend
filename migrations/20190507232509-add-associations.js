const associations = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Articles',
    'authorId',
    {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    }
  ),
  down: queryInterface => queryInterface.removeColumn('Articles', 'authorId')


};
export default associations;
