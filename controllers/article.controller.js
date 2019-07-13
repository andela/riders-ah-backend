import ArticleHelper from '../helpers/article';
import tagHelper from '../helpers/tag.helper';
import statsHelper from '../helpers/read.stats.helper';
import userHelper from '../helpers/userHelper';
import recordHelper from '../helpers/passport';
import models from '../models';

const { Article, ReadingStat } = models;
/**
 * @author Samuel Niyitanga
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
    await ArticleHelper.updateArticle(req);
    const response = {
      status: res.statusCode,
      Message: 'Article updated successfully.'
    };

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
    const articleId = article.dataValues.id;
    const tags = await tagHelper.getTagsByArticle(article.dataValues.id);

    const userId = await userHelper.findUserByToken(req.headers.authorization);
    const isArticleAuthor = await recordHelper.findRecord(Article, {
      id: articleId,
      authorId: userId
    });
    const hasRead = await recordHelper.findRecord(ReadingStat, {
      articleId,
      userId
    });

    if (!isArticleAuthor && !hasRead) {
      await statsHelper.saveReadingStats({ userId, articleId, isDuplicate: false });
    } else if (!isArticleAuthor && (hasRead)) {
      await statsHelper.saveReadingStats({ userId, articleId, isDuplicate: true });
    }

    article.dataValues.tagList = tags;
    return res.status(200).send({ article });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getAllArticles(req, res) {
    const articles = await ArticleHelper.getAllArticles(req);
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
    await ArticleHelper.deleteArticle(req);
    const response = {
      status: res.statusCode,
      message: 'Article deleted'
    };
    return res.status(200).send(response);
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async tagArticle(req, res) {
    const newCreatedTag = await ArticleHelper.createArticleTag(req);
    return res.status(201).json({
      status: 201,
      tag: newCreatedTag
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getAllTags(req, res) {
    const tagList = await ArticleHelper.listTags();
    return res.status(200).json({
      status: 200,
      tags: tagList
    });
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

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async shareArticle(req, res) {
    const article = await ArticleHelper.findArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).send({ errors: { body: ['article not found'] } });
    }
    const result = await ArticleHelper.shareArticle(req);
    if (result) {
      const createdShare = await ArticleHelper.createShare(req);
      return res.status(201).send({ share: createdShare });
    }
    return res.status(400).send({ errors: { body: ['share not created'] } });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async bookmarkArticle(req, res) {
    const { bookmark } = req.body;
    if (bookmark === 'SequelizeUniqueConstraintError') {
      const result = await ArticleHelper.deleteBookmark(req);
      return res.status(200).send(result);
    }
    return res.status(201).send({ Bookmark: bookmark });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getShares(req, res) {
    const { slug } = req.params;
    const article = await ArticleHelper.findArticleBySlug(slug);
    if (!article) {
      return res.status(404).send({ errors: { body: ['article not found'] } });
    }
    const shares = await ArticleHelper.getShares(slug);
    if (shares.length < 1) {
      return res
        .status(200)
        .send({ message: 'this article has not been shared yet' });
    }
    const numberOfSharesOnPlatform = await ArticleHelper.numberOfSharesOnPlatform(
      shares
    );
    const facebook = numberOfSharesOnPlatform[0];
    const twitter = numberOfSharesOnPlatform[1];
    const linkedin = numberOfSharesOnPlatform[2];
    const gmail = numberOfSharesOnPlatform[3];
    return res.status(200).send({
      titleSlug: slug,
      Shares: shares,
      facebookShares: facebook,
      twitterShares: twitter,
      linkedinShares: linkedin,
      gmailShares: gmail
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getBookmarks(req, res) {
    const { id } = req.user;
    const bookmarks = await ArticleHelper.getBookmarks(id);
    return res.status(200).send({ Bookmarks: bookmarks });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async highlightText(req, res) {
    const highlightAndComment = await ArticleHelper.highlightedText(req);
    if (highlightAndComment.error) {
      return res.status(400).send({ status: 400, errors: { body: highlightAndComment.error } });
    }
    return res.status(201).send({ status: 201, data: highlightAndComment });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getHighlightText(req, res) {
    const highlights = await ArticleHelper.getHighlightedText(req);
    if (highlights.error) {
      return res.status(404).send({ status: 404, errors: { body: [highlights.error] } });
    }
    return res.status(200).send({ status: 200, data: highlights });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getCommentHighlights(req, res) {
    const highlights = await ArticleHelper.getHighlightedTextComment(req);
    if (highlights.error) {
      return res.status(404).send({ status: 404, errors: { body: [highlights.error] } });
    }
    return res.status(200).send({ status: 200, data: highlights });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async addCommentHighlights(req, res) {
    const comment = await ArticleHelper.commentHighlighedText(req);
    return res.status(201).send({ status: 201, data: comment });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async reportArticle(req, res) {
    const { reason } = req.body;
    const userId = req.user.id;
    const { reportType, slug } = req.params;

    await ArticleHelper.saveReportedArticle({
      articleSlug: slug, userId, reportType, reason: reason || null
    });
    return res.status(201).json({
      status: 201,
      message: 'Article has successfully reported'
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getAllReportedArticle(req, res) {
    const reports = await ArticleHelper.getReportedArticles();
    const totalReports = reports.count;
    const data = {
      total: totalReports,
      reports: reports.rows
    };

    return res.status(200).send({
      status: 200,
      data
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getAllCommentHighlights(req, res) {
    const highlights = await ArticleHelper.getallHighlightedTextComment(req);
    if (highlights.error) {
      return res.status(404).send({ status: 404, errors: { body: [highlights.error] } });
    }
    return res.status(200).send({ status: 200, data: highlights });
  }
}

export default ArticleController;
