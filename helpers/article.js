import slugify from 'slug';
import uniqid from 'uniqid';
import Joi from 'joi';
import PassportHelper from './passport';
import db from '../models';

const { Article, User } = db;

/**
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
      slug,
      authorId: articleAuthor.id
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
        error: 'You don\'t have access'
      });
    }
    next();
  }

  /**
     * Check article owner
     * @param {object} req - an object
     * @return {object} Returns response
     * @static
     */
  static async updateArticle(req) {
    const {
      title, ...update
    } = req.body;
    if (title) {
      const newslug = ArticleHelper.createSlug(title);
      update.title = title;
      update.slug = newslug;
    }
    const updatedArticle = await Article.update(update, { where: { slug: req.params.slug } });
    return updatedArticle;
  }

  /**
     * Return if the user is owner
     * @param {object} req - an object
     * @param {object} res - an object
     *@return {boolean} Return true if user matche
     */
  static async deleteArticle(req) {
    const currentSlug = req.params.slug;
    const deletedArticle = await
    Article.destroy({ where: { slug: currentSlug }, returning: true });
    return deletedArticle;
  }

  /**
     * Return if the user is owner
     *@return {object} Return all articles
     */
  static async getAllArticles() {
    const articles = await Article.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    });
    return articles;
  }

  /**
     * Return one article
     * @param {object} req - an object
     *@return {object} Return all articles
     */
  static async getOneArticle(req) {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'bio', 'image']
      }],
      attributes: ['slug', 'title', 'description', 'body', 'createdAt', 'updatedAt']
    });
    return article;
  }
}
export default ArticleHelper;
