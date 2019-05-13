import ArticleHelper from '../helpers/article';

/**
 * @exports ArticleController
 * @class ArticleController
 * @description Handles all related articles functioanlities
 * */
class ArticleController {
  /**
     * Create a new article
     * @async
     * @param  {object} req - Request object
     * @param {object} res - Response object
     * @return {json} Returns json object
     * @static
     */
  static async createArticle(req, res) {
    const result = await ArticleHelper.createNewArticle(req);
    const article = result.article.toJSON();
    return res.status(201).send({
      article: { ...article, author: result.userData }
    });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async updateArticle(req, res) {
    let response;
    try {
      await ArticleHelper.updateArticle(req);
      response = {
        status: res.statusCode,
        Message: 'Article updated successfully.'
      };
    } catch (error) {
      return res.send(error);
    }


    return res.status(200).send(response);
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getArticle(req, res) {
    const article = await ArticleHelper.getOneArticle(req);
    if (!article) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'Article Not found'
      });
    }
    return res.status(200).send({ article });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getAllArticles(req, res) {
    const articles = await ArticleHelper.getAllArticles();
    if (!articles) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'Articles Not found'
      });
    }
    return res.status(200).send({ articles });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async deleteArticle(req, res) {
    let response;
    try {
      await ArticleHelper.deleteArticle(req);
      response = {
        status: res.statusCode,
        message: 'Article deleted'
      };
    } catch (error) {
      return res.send(error);
    }


    return res.status(200).send(response);
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async reactOnArticle(req, res) {
    const result = await ArticleHelper.createReaction(req);
    const reactionCreated = result.toJSON();
    return res.status(201).send({ reaction: reactionCreated });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getLikes(req, res) {
    const { numberOfLikes } = req.body;
    const result = await ArticleHelper.getLikes(req);
    return res.status(200).send({ likes: result, count: numberOfLikes });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getDislikes(req, res) {
    const { numberOfDislikes } = req.body;
    const result = await ArticleHelper.getDislikes(req);
    return res.status(200).send({ dislikes: result, count: numberOfDislikes });
  }
}

export default ArticleController;
