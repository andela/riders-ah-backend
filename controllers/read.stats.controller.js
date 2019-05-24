import statsHelper from '../helpers/read.stats.helper';

/**
 * @exports ReadStatController
 * @class ReadStatController
 * @description Give statistics for reading articles
 * */
class ReadStatController {
  /**
     * Get statistics for reading
     * @function userReadingStats
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async getUserReadingStats(req, res) {
    const userId = req.user.id;
    const readingStats = await statsHelper.getReadingStats(userId);

    return res.status(200).json({
      status: 200,
      readStats: readingStats
    });
  }

  /**
     * Get statistics for reading
     * @function articlesReadingStats
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async getArticlesReadingStats(req, res) {
    const articleStats = await statsHelper.getArticlesStats(req.user.id);

    return res.status(200).json({
      status: 200,
      articles: articleStats
    });
  }
}
export default ReadStatController;
