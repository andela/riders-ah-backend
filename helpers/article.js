import slugify from 'slug';
import uniqid from 'uniqid';
import Joi from 'joi';
import open from 'open';
import PassportHelper from './passport';
import db from '../models';
import emitter from './eventEmitters';
import tagHelper from './tag.helper';
import readTime from './readTime';

const {
  Article, User, Tag, Like, Share, Bookmark
} = db;

/**
 * @author Samuel Niyitanga
 * @exports ArticleHelper
 * @class ArticleHelper
 * @description Article Helper
 * */
class ArticleHelper {
  /**
   * Create a slug based on title
   * @param {string} title - a title
   * @return {string} Returns a slug created
   * @static
   */
  static createSlug(title) {
    const slug = `${slugify(title, { lower: true })}-${uniqid.process()}`;
    return slug;
  }

  /**
   * Create a new article
   * @param {object} req - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static async createNewArticle(req) {
    const {
      body, title, description, image
    } = req.body;
    const readingTime = readTime(body, title, description);
    const slug = ArticleHelper.createSlug(title);
    const articleAuthor = await PassportHelper.findRecord(User, req.user.id);
    const userData = {
      username: articleAuthor.username,
      email: articleAuthor.email,
      bio: articleAuthor.bio,
      image: articleAuthor.image
    };
    const article = await Article.create({
      title,
      body,
      description,
      image,
      readingTime,
      slug,
      authorId: articleAuthor.id
    });
    emitter.emit('onFollowPublish', {
      title,
      authorId: articleAuthor.id,
      slug
    });
    const values = {
      userData,
      article
    };
    return values;
  }

  /**
   * Check if it is a Article
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static isValidArticle(req, res, next) {
    const schema = Joi.object().keys({
      body: Joi.string().required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return ArticleHelper.invalidDataMessage(res, result);
    }
    next();
  }

  /**
   * update an article
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static isValidUpdatedArticle(req, res, next) {
    const schema = Joi.object().keys({
      body: Joi.string().min(3),
      title: Joi.string().min(3),
      description: Joi.string().min(3),
      image: Joi.string().min(3)
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return ArticleHelper.invalidDataMessage(res, result);
    }
    next();
  }

  /**
   * Return Invalid data message
   * @param {object} res - an object with response
   *@param{object} result - an object with all errors
   *@return {res} Returns a response with error
   * @static
   */
  static invalidDataMessage(res, result) {
    const errors = [];
    for (let index = 0; index < result.error.details.length; index += 1) {
      errors.push(result.error.details[index].message.split('"').join(' '));
    }
    return res.status(422).send({ status: 422, Error: errors });
  }

  /**
   * Check article owner
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {object} Returns response
   * @static
   */
  static async isOwner(req, res, next) {
    const currentSlug = req.params.slug;
    const isExist = await Article.findOne({ where: { slug: currentSlug } });
    if (!isExist) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'Article Not found'
      });
    }
    const isOwner = req.user.id === isExist.dataValues.authorId;
    if (!isOwner) {
      return res.status(401).send({
        status: res.statusCode,
        error: "You don't have access"
      });
    }
    req.user.articleId = isExist.dataValues.id;
    next();
  }

  /**
   * Update article
   * @param {object} req - an object
   * @return {object} Returns response
   * @static
   */
  static async updateArticle(req) {
    const { title, ...update } = req.body;
    if (title) {
      const newslug = ArticleHelper.createSlug(title);
      update.title = title;
      update.slug = newslug;
    }
    const updatedArticle = await Article.update(update, { where: { slug: req.params.slug } });
    return updatedArticle;
  }

  /**
   * Delete article
   * @param {object} req - an object
   * @param {object} res - an object
   *@return {boolean} Return true if deleted
   */
  static async deleteArticle(req) {
    const currentSlug = req.params.slug;
    const deletedArticle = await Article.destroy({ where: { slug: currentSlug }, returning: true });
    return deletedArticle;
  }

  /**
   * Return all article
   *@param {@object} req request
   *@return {object} Return all articles
   */
  static async getAllArticles(req) {
    const { limit, offset } = req.query;
    const errorMessage = [];
    if (!/^(0|[1-9]\d*)$/.test(limit) && limit !== undefined) {
      errorMessage.push('Limit must be a number');
    }
    if (!/^(0|[1-9]\d*)$/.test(offset) && offset !== undefined) {
      errorMessage.push('Offset must be a number');
    }
    if (errorMessage.length) {
      return { status: 400, errors: { body: errorMessage } };
    }
    const articles = await Article.findAll({
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'bio', 'image']
        },
        {
          model: Tag,
          as: 'tagList',
          attributes: ['name'],
          raw: true
        }
      ],
      attributes: ['id', 'authorId', 'slug', 'title', 'description', 'readingTime', 'body', 'createdAt', 'updatedAt']
    });
    const articlesWithTags = await tagHelper.addTagsToArticles(articles);
    return articlesWithTags;
  }

  /**
   * Return one article
   * @param {object} req - an object
   *@return {object} Return  article
   */
  static async getOneArticle(req) {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'bio', 'image']
        }
      ],
      attributes: [
        'id',
        'slug',
        'title',
        'description',
        'readingTime',
        'body',
        'createdAt',
        'updatedAt'
      ]
    });
    return article;
  }

  /**
   * Check article owner
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {object} Returns response
   * @static
   */
  static async isExisting(req, res, next) {
    const { slug } = req.params;
    const { id } = req.user;
    const { option } = req.params;
    const result = await Article.findOne({ where: { slug } });
    if (!result) {
      return res.status(404).send({ message: `article with slug ${slug} do not exist` });
    }
    const Result = await Like.findOne({ where: { titleSlug: slug, userId: id } });
    if (!Result) {
      next();
      return true;
    }
    if (option === 'dislike' && Result.status === 'like') {
      await Like.update({ status: 'dislike' }, { where: { titleSlug: slug, userId: id } });
      return res.status(200).send({ message: 'like is replaced by dislike' });
    }
    if (option === 'like' && Result.status === 'dislike') {
      await Like.update({ status: 'like' }, { where: { titleSlug: slug, userId: id } });
      return res.status(200).send({ message: 'dislike is replaced by like' });
    }
    if (Result.status === 'neutral') {
      await Like.update({ status: option }, { where: { titleSlug: slug, userId: id } });
      return res.status(200).send({ message: 'reaction updated' });
    }
    await Like.update({ status: 'neutral' }, { where: { titleSlug: slug, userId: id } });
    return res.status(200).send({ message: 'your reaction is now neutral' });
  }

  /**
   * function for number of likes on an article
   * @function likesNumber
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { number } number of comments
   */
  static async likesNumber(req, res, next) {
    let number = 0;
    const { slug } = req.params;
    const result = await Like.findAll({
      where: { titleSlug: slug, status: 'like' },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'titleSlug', 'status']
    });
    result.forEach(() => {
      number += 1;
    });
    req.body.numberOfLikes = number;
    next();
    return true;
  }

  /**
   * function for number of likes on an article
   * @function dislikesNumber
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { number } number of comments
   */
  static async dislikesNumber(req, res, next) {
    let number = 0;
    const { slug } = req.params;
    const result = await Like.findAll({
      where: { titleSlug: slug, status: 'dislike' },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'titleSlug', 'status']
    });
    result.forEach(() => {
      number += 1;
    });
    req.body.numberOfDislikes = number;
    next();
    return true;
  }

  /**
   * Create a new article
   * @param {object} req - an object
   * @return {Object} Returns if true if it is valid else return false
   * @static
   */
  static async createReaction(req) {
    const { id } = req.user;
    const { slug } = req.params;
    const { option } = req.params;
    const reactionCreated = await Like.create({
      userId: id,
      titleSlug: slug,
      status: option
    });
    return reactionCreated;
  }

  /**
   * Create a new article
   * @param {object} req - an object
   * @return {Object} Returns an object
   * @static
   */
  static async getLikes(req) {
    const { slug } = req.params;
    const likesFetched = await Like.findAll({
      where: { titleSlug: slug, status: 'like' },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'titleSlug', 'status']
    });
    return likesFetched;
  }

  /**
   * Create a new article
   * @param {object} req - an object
   * @return {Object} Returns if true if it is valid else return false
   * @static
   */
  static async getDislikes(req) {
    const { slug } = req.params;
    const likesFetched = await Like.findAll({
      where: { titleSlug: slug, status: 'dislike' },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'titleSlug', 'status']
    });
    return likesFetched;
  }

  /**
   * Get article by its ID
   * @function findArticleBySlug
   * @param {number} slug - Response object
   * @return {object} Returns json object of an article
   * @static
   */
  static async findArticleBySlug(slug) {
    const article = await Article.findOne({ where: { slug }, logging: false });
    return article;
  }

  /**
   * @param  {object} req - Request object
   * @returns {object} response
   *  @static
   */
  static async createArticleTag(req) {
    const createdTag = await Tag.create({
      name: req.body.name,
      articleId: req.user.articleId
    });
    return createdTag.dataValues;
  }

  /**
   * @returns {object} response
   *  @static
   */
  static async listTags() {
    const tagList = await Tag.aggregate('name', 'DISTINCT', { plain: false }).map(row => row.DISTINCT);
    return tagList || [];
  }

  /**
   * function for checking if a platform  is valid
   * @function isShared
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { string } appropriate message
   */
  static async isPlatformValid(req, res, next) {
    const { option } = req.params;
    const platforms = ['facebook', 'twitter', 'gmail', 'linkedin'];
    if (platforms.includes(option)) {
      next();
      return true;
    }
    return res.status(400).send({ errors: { body: ['invalid platform in path'] } });
  }

  /**
   * function for checking if article is alreadry shared or not
   * @function isShared
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns { string } appropriate message
   */
  static async isShared(req, res, next) {
    const { option } = req.params;
    const { id } = req.user;
    const share = await Share.findOne({ where: { userId: id } });
    if (!share) {
      next();
      return true;
    }
    const { platform } = share;
    if (platform.includes(option)) {
      const updatePlatforms = platform.filter(result => result !== option);
      await Share.update({ platform: updatePlatforms }, { where: { userId: id } });
      return res
        .status(200)
        .send({ message: `your ${option} share is removed, you can share again` });
    }
    next();
    return true;
  }

  /**
 * function for creating bookmarks on articles
 * @function createBookmark
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { number } appropriate message
 */
  static async articleToBookmark(req, res, next) {
    const { slug } = req.params;
    const article = await Article.findOne({ where: { slug } });
    if (!article) { return res.status(404).send({ errors: { body: ['article not found'] } }); }
    next();
    return true;
  }

  /**
 * function for creating bookmarks on articles
 * @function createBookmark
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns { number } appropriate message
 */
  static createBookmark(req, res, next) {
    const { slug } = req.params;
    const { id } = req.user;
    Bookmark.create({
      userId: id,
      titleSlug: slug,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then((bookmark) => {
      req.body.bookmark = bookmark;
      next();
      return true;
    })
      .catch((error) => {
        req.body.bookmark = error.name;
        next();
        return true;
      });
  }

  /**
  * @param  {object} req - Request object
  * @returns {object} response
  *  @static
  */
  static async shareArticle(req) {
    const { option } = req.params;
    const { slug } = req.params;
    const { SHARE_URL } = process.env;
    const articleShareUrl = `${SHARE_URL}${slug}`;
    if (option === 'facebook') {
      const result = await open(`http://www.facebook.com/sharer/sharer.php?u=${articleShareUrl}`);
      return result;
    }
    if (option === 'twitter') {
      const result = await open(`https://twitter.com/intent/tweet?text=${articleShareUrl}`);
      return result;
    }
    if (option === 'gmail') {
      const result = await open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Authorshaven%20Post&body=copy%20the%20following%20link%20to%20open%20the%20article%20${articleShareUrl}`);
      return result;
    }
    if (option === 'linkedin') {
      const result = await open(`https://www.linkedin.com/sharing/share-offsite/?url=${articleShareUrl}`);
      return result;
    }
  }

  /**
   * @param  {object} req - Request object
   * @returns {object} response
   *  @static
   */
  static async createShare(req) {
    const { option } = req.params;
    const { slug } = req.params;
    const { id } = req.user;
    const share = await Share.findOne({ where: { userId: id } });
    if (!share) {
      await Share.create({
        userId: id,
        titleSlug: slug,
        platform: [option],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const firstShare = await Share.findOne({ where: { userId: id } });
      return firstShare;
    }
    const { platform } = share;
    platform.push(option);
    const newPlatform = platform;
    await Share.update(
      {
        platform: newPlatform,
        updatedAt: new Date()
      },
      { where: { userId: id } }
    );
    const createdShare = await Share.findOne({ where: { userId: id } });
    return createdShare;
  }

  /**
   * Return one article
   * @param {object} slug - an object
   *@return {object} Return  shares
   */
  static async getShares(slug) {
    const shares = await Share.findAll({
      where: { titleSlug: slug },
      attributes: ['userId', 'platform', 'createdAt'],
      raw: true
    });
    return shares;
  }

  /**
   * Return one article
   * @param {object} shares - an object
   *@return {object} Return  shares
   */
  static async numberOfSharesOnPlatform(shares) {
    let facebook = 0;
    let twitter = 0;
    let linkedin = 0;
    let gmail = 0;
    shares.forEach((share) => {
      const Platform = share.platform;
      if (Platform.includes('facebook')) {
        facebook += 1;
      }
      if (Platform.includes('twitter')) {
        twitter += 1;
      }
      if (Platform.includes('linkedin')) {
        linkedin += 1;
      }
      if (Platform.includes('gmail')) {
        gmail += 1;
      }
    });
    return [facebook, twitter, linkedin, gmail];
  }

  /**
  * @param  {object} req - Request object
  * @returns {object} response
  *  @static
  */
  static async deleteBookmark(req) {
    const { slug } = req.params;
    const { id } = req.user;
    await Bookmark.destroy({ where: { userId: id, titleSlug: slug } });
    return { message: `your bookmark is for article with slug ${slug} is removed, bookmark again` };
  }

  /**
  * @param  {number} id - Request object
  * @returns {object} response
  *  @static
  */
  static async getBookmarks(id) {
    const bookmarks = await Bookmark.findAll({
      where: { userId: id },
      include: [{ model: Article, as: 'article', attributes: ['title', 'description', 'slug'] }],
      attributes: ['id', 'userId', 'createdAt']
    });
    if (bookmarks.length < 1) {
      return 'no bookmarks made';
    }
    return bookmarks;
  }
}
export default ArticleHelper;
