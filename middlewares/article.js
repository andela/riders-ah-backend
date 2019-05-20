import Articlehepler from '../helpers/articleRatevalidator';

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
}
export default ArticleMiddleware;
