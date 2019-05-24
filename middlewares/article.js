import Sequelize from 'sequelize';
import Articlehepler from '../helpers/articleRatevalidator';
import searchArticleHelper from '../helpers/article';

const { Op } = Sequelize;

/**
 * @exports ArticleMiddleware
 * @class ArticleMiddleware
 * @description Article Middleware
 * */
class ArticleMiddleware {
  /**
     * Validate article and rate
     * @param {string} req - a request
     * @param {string} res - a response
     * @param {string} next - next function for continue
     * @return {string} Returns error or proceed the execution
     * @static
     */
  static async checkRatedArticle(req, res, next) {
    const errorMessage = [];
    if (req.body.rate === undefined) {
      errorMessage.push('Oops! Rate is required');
    }
    const validateArticle = await Articlehepler.validateArticleRated(req.params.slug, req.user.id);
    if (validateArticle !== true) {
      errorMessage.push(validateArticle);
    }
    const validateRate = await Articlehepler.validateRating(req.body.rate);
    if (validateRate !== true) {
      errorMessage.push(validateRate);
    }
    if (errorMessage.length) {
      return res.status(400).json({ status: 400, errors: { body: errorMessage } });
    }
    next();
  }

  /**
     * Validate article and rate
     * @param {string} req - a request
     * @param {string} res - a response
     * @param {string} next - next function for continue
     * @return {string} Returns error or proceed the execution
     * @static
     */
  static async searchArticle(req, res, next) {
    const {
      author, title, tag, keyword
    } = req.query;
    let param;
    if (author && !title && !tag && !keyword) {
      param = { username: { [Op.iLike]: author } };
      const result = await searchArticleHelper.searchArticle(param);
      return res.status(200).send(result);
    }
    next();
    return true;
  }
}
export default ArticleMiddleware;
