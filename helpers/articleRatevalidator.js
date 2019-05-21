import db from '../models';

const { Article, User, Rating } = db;

/**
 * @exports ArticleRatelehelper
 * @class Articlehelper
 * @description Helps to generate token and passwor hashing
 * */
class ArticleRatelehelper {
  /**
       * Check the environment
       * @function validateArticleRated
       * @param  {string} slug - Check the rate
       * @param  {integer} user - Check the user
       * @return {string} Validate the rate
       */
  static async validateArticleRated(slug, user) {
    const findarticle = await Article.findOne({ where: { slug } });
    if (findarticle) {
      const articleOwner = await Article.findAll({
        where: { slug, authorId: user }
      });
      if (articleOwner.length) {
        return 'Oops! You cannot rate your article';
      }
    }
    if (findarticle == null) {
      return 'This Article does not exist';
    }
    return true;
  }

  /**
     * Check the environment
     * @function validateRating
     * @param  {string} rate - Check the rate
     * @return {string} Validate the rate
     */
  static validateRating(rate) {
    const regRaterange = /^[1-5]{1}?$/;
    if (!regRaterange.test(rate)) {
      return 'Rate must be between 1 and 5';
    }
    return true;
  }

  /**
     * get all ratings
     * @param {object} req - an object
     *@return {object} Return ratings of an aricle
     */
  static async getRating(req) {
    const { slug } = req.params;
    const errorMessage = [];
    const getArticle = await Article.findOne({
      where: { slug }
    });
    if (getArticle == null) {
      return { status: 404, errors: 'This article does not exist' };
    }
    let { limit, offset } = req.query;
    if (limit === undefined || offset === undefined) {
      limit = 20;
      offset = 0;
    }
    if (!/^(0|[1-9]\d*)$/.test(limit) && limit !== undefined) {
      errorMessage.push('Limit must be a number');
    }
    if (!/^(0|[1-9]\d*)$/.test(offset) && offset !== undefined) {
      errorMessage.push('Offset must be a number');
    }
    if (errorMessage.length) {
      return { status: 400, errors: { body: errorMessage } };
    }
    const getRate = await Rating.findAll({
      limit,
      offset,
      where: { articleSlug: slug },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }]
    });
    return getRate;
  }
}

export default ArticleRatelehelper;
