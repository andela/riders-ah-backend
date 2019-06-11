const statsDuplicate = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('ReadingStats', 'isDuplicate', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }),
  down: queryInterface => queryInterface.removeColumn('ReadingStats', 'isDuplicate')
};
export default statsDuplicate;
