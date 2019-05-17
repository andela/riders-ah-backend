import helper from '../helpers/tag.helper';

/**
 * @exports TagMiddleware
 * @class TagMiddleware
 * @description Tag Middleware
 * */
class TagMiddleware {
  /**
   * Check if the same tag was added before
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - calls the next middleware
   * @return {json} Returns json object
   * @static
   */
  static async isNotTagAdded(req, res, next) {
    const tagName = req.body.name;
    if (tagName === undefined || tagName === '' || !Number.isNaN(Number(tagName))) {
      return res.status(400).json({
        status: 400,
        errors: { body: ['Provide tag name'] }
      });
    }

    const articleTags = await helper.getArticleTag(req.user.articleId, tagName);
    if (!articleTags.length) return next();
    return res.status(409).json({
      status: 409,
      errors: { body: ['The tag was already added'] }
    });
  }
}

export default TagMiddleware;
