import db from '../models';

const { Article } = db;

/**
 * @exports ArticRatelehelper
 * @class Articlehelper
 * @description Helps to generate token and passwor hashing
 * */
class ArticRatelehelper {
  /**
       * Check the environment
       * @function validateArticleRated
       * @param  {string} article - Check the rate
       * @param  {integer} user - Check the user
       * @return {string} Validate the rate
       */
  static async validateArticleRated(article, user) {
    const findarticle = await Article.findOne({ where: { id: article } });
    if (findarticle) {
      const articleOwner = await Article.findAll({
        where: { id: article, authorId: user }
      });
      if (articleOwner.length) {
        return 'Oops! You cannot rate your article';
      }
    } else {
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
}

export default ArticRatelehelper;
