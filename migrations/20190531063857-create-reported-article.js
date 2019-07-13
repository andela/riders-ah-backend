const reportedArticleMigration = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ReportedArticles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
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
    articleSlug: {
      type: Sequelize.STRING,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      references: {
        model: 'Articles',
        key: 'slug'
      }
    },
    reportType: {
      type: Sequelize.ENUM,
      values: ['plagiarism', 'spam', 'harassment', 'others']
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: true
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
  down: queryInterface => queryInterface.dropTable('ReportedArticles')
};

export default reportedArticleMigration;
