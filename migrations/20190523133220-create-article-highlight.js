const articleHighlightsMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ArticleHighlights', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    articleSlug: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'slug'
      }
    },
    userId: {
      type: Sequelize.INTEGER,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    startIndex: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    endIndex: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    highlightedText: {
      allowNull: false,
      type: Sequelize.STRING
    },
    blockId: {
      allowNull: false,
      type: Sequelize.STRING
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
  down: queryInterface => queryInterface.dropTable('ArticleHighlights')
};

export default articleHighlightsMigration;
