import models from '../models';

const {
  Article, ReadingStat, User, Sequelize
} = models;
/**
 * @class ReadStatsHelper
 * @description Helper for reading statistics
 * */
class ReadStatsHelper {
  /**
  * @function saveReadingStats
  * @param  {number} userId - User ID
  * @param  {number} articleId - Article ID
  * @returns {object} object of article statistics that created
  *  @static
  */
  static async saveReadingStats(userId, articleId) {
    const newReadStat = await ReadingStat.create({
      articleId,
      userId
    });
    return newReadStat;
  }

  /**
  * @function getAllData
  * @param  {string} type - readers or articles
  * @returns {number} - Number of all data
  *  @static
  */
  static async getAllData(type) {
    const dataType = type === 'userId' ? 'userId' : 'articleId';
    const statsList = await ReadingStat.aggregate(dataType, 'DISTINCT', {
      plain: false
    }).map(row => row.DISTINCT);
    return statsList.length;
  }

  /**
  * @function articlesStats
  * @param  {number} userId - User ID
  * @returns {object} object of articles and their reading stats
  *  @static
  */
  static async getArticlesStats(userId) {
    const articles = await Article.findAll({
      where: { authorId: userId },
      attributes: ['id', 'title']
    });
    const allReaders = await this.getAllData('userId');
    await Promise.all(articles.map(async (currentArticle) => {
      const { id } = currentArticle.dataValues;
      const readStats = await ReadingStat.findAndCountAll({
        where: { articleId: id, userId: { [Sequelize.Op.ne]: null } },
        attributes: [],
        include: [{ model: User, attributes: ['username', 'bio', 'image'] }]
      });

      const notRegistered = await ReadingStat.count({
        where: { articleId: id, userId: null },
      });
      const readPercantage = ((Number(readStats.count) / allReaders) * 100) || 0;

      currentArticle.dataValues.notRegistered = notRegistered;
      currentArticle.dataValues.registered = readStats.count;
      currentArticle.dataValues.percentage = readPercantage.toFixed(2);
      currentArticle.dataValues.readers = readStats.rows;

      return currentArticle;
    }));
    return articles;
  }

  /**
  * @function readStats
  * @param  {number} userId - User ID
  * @returns {object} object of articles and their reading stats
  *  @static
  */
  static async getReadingStats(userId) {
    const stats = await ReadingStat.findAll({
      where: { userId },
      include: [{
        model: Article, attributes: ['title']
      }],
      attributes: ['articleId', 'createdAt']
    });
    const allArticles = await this.getAllData('articleId');
    const articles = [];
    await Promise.all(stats.map(async (currentStat) => {
      const { articleId } = currentStat.dataValues;
      const { title } = currentStat.dataValues.Article;

      articles.push({ articleId, title });
    }));
    const percentage = ((articles.length * 100) / allArticles) || 0;
    return { articles, percentage };
  }
}

export default ReadStatsHelper;
