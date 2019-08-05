import models from '../models';

const {
  Article, ReadingStat, User, Sequelize, Comment, Like, Share
} = models;
/**
 * @class ReadStatsHelper
 * @description Helper for reading statistics
 * */
class ReadStatsHelper {
  /**
  * @function saveReadingStats
  * @param  {object} statsInfo - User ID
  * @returns {object} object of article statistics that created
  *  @static
  */
  static async saveReadingStats(statsInfo) {
    const { articleId, userId, isDuplicate } = statsInfo;
    const newReadStat = await ReadingStat.create({
      articleId,
      userId,
      isDuplicate
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
  * @function getArticleReaders
  * @param  {array} duplicateReaders - Article ID
  * @returns {array} - Array of users
  *  @static
  */
  static async getArticleReaders(duplicateReaders) {
    const readers = [];
    const nonDuplicates = [];
    duplicateReaders.forEach((reader) => {
      const { userId } = reader.dataValues;
      const index = nonDuplicates.indexOf(userId);
      if (index === -1) nonDuplicates.push(userId);
    });
    await Promise.all(nonDuplicates.map(async (reader) => {
      const userInfo = await User.findOne({
        where: { id: reader },
        attributes: ['firstName', 'lastName', 'username']
      });
      readers.push({
        id: reader,
        firstName: userInfo.dataValues.firstName,
        lastName: userInfo.dataValues.lastName,
        username: userInfo.dataValues.username
      });
    }));
    return readers;
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
      attributes: ['id', 'title', 'slug'],
      logging: false
    });
    const stats = [];
    await Promise.all(articles.map(async (currentArticle) => {
      const { id, slug, title } = currentArticle.dataValues;
      const registered = await ReadingStat.findAndCountAll({
        where: { articleId: id, userId: { [Sequelize.Op.ne]: null } },
        logging: false
      });
      const notRegistered = await ReadingStat.count({
        where: { articleId: id, userId: null },
        logging: false
      });

      const notDuplicates = await ReadingStat.count({
        where: { articleId: id, isDuplicate: false },
        logging: false
      });
      const duplicates = await ReadingStat.count({
        where: { articleId: id, isDuplicate: true },
        logging: false
      });
      const totalComments = await Comment.count({ where: { titleSlug: slug }, logging: false });
      const totalLikes = await Like.count({ where: { titleSlug: slug, status: 'like' }, logging: false });
      const totaldDisLikes = await Like.count({ where: { titleSlug: slug, status: 'dislike' }, logging: false });
      const totalShares = await Share.count({ where: { titleSlug: slug }, logging: false });

      const totalViews = notDuplicates + duplicates;
      const readers = await this.getArticleReaders(registered.rows);

      stats.push({
        id,
        slug,
        title,
        notRegistered,
        registered: registered.count,
        totalViews,
        totalComments,
        totalLikes,
        totaldDisLikes,
        totalShares,
        readers
      });
    }));
    return stats;
  }

  /**
  * @function readStats
  * @param  {number} userId - User ID
  * @returns {object} object of articles and their reading stats
  *  @static
  */
  static async getReadingStats(userId) {
    let stats = await ReadingStat.findAll({
      where: { userId },
      include: [{
        model: Article, attributes: ['title']
      }],
      attributes: ['articleId', 'createdAt']
    });
    stats = stats.filter((stat, index, self) => index === self.findIndex(t => (
      t.dataValues.articleId === stat.dataValues.articleId
    )));
    const articles = [];
    await Promise.all(stats.map(async (currentStat) => {
      const { articleId } = currentStat.dataValues;
      const { title } = currentStat.dataValues.Article;

      articles.push({ articleId, title });
    }));
    return articles;
  }
}

export default ReadStatsHelper;
