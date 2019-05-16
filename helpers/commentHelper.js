import joi from 'joi';
import model from '../models';

const { User, Article, Comment } = model;

/**
 * @exports CommentHelper
 * @class CommentHelper
 * @description Comment Helper
 * */
class CommentHelper {
  /**
     * Check and return the previous comment's id
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {integer} Returns previous comment's id
     * @static
     */
  static async parentId(req, res, next) {
    let maxId = 1;
    await Comment.findAll().then((result) => {
      // eslint-disable-next-line array-callback-return
      result.map((comment) => {
        if (comment.id > maxId) {
          maxId = comment.id;
        }
      });
    });
    req.body.previousId = maxId;
    next();
  }

  /**
     * Check if Article exist and comment body is there
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return a message explaining an error
     * @static
     */
  static async isValid(req, res, next) {
    const { slug } = req.params;
    const article = await Article.findOne({
      where: {
        slug
      }
    });
    if (!article) {
      return res.status(400).send({ message: 'there is no article with the slug specified in the URL' });
    }
    const body = {
      data: req.body.body
    };
    const schema = joi.object().keys({
      data: joi
        .string()
        .trim()
        .required()
    });
    const { error } = joi.validate(body, schema);
    if (error) {
      return res.status(400).send({ message: 'INVALID comment body' });
    }
    next();
  }

  /**
     * create a comment
     * @param {object} req - an object
     *@return {object} Return the created comment
     */
  static async createComment(req) {
    const parentID = req.body.previousId;
    const { slug } = req.params;

    const createdComment = await Comment.create({
      userId: req.user.id,
      titleSlug: slug,
      body: req.body.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const childComment = createdComment.toJSON();

    const parentComment = await Comment.findOne({ where: { id: parentID } });
    if (parentComment === null) {
      return { message: 'this is the first comment', id: childComment.id, userId: req.user.id };
    }
    if (parentComment.userId !== childComment.userId) {
      return childComment;
    }
    const range = childComment.createdAt.getTime() - parentComment.createdAt.getTime();

    if (range <= 60000) {
      await Comment.update({ parentid: parentID }, { where: { id: childComment.id } });
      return { type: 'threadedComment comment created', timeRange: `${range} milliseconds` };
    }
    return { type: 'no threadedComment created', timeRange: `${range} milliseconds` };
  }

  /**
     * get all comment
     * @param {object} req - an object
     *@return {object} Return all comments on an article
     */
  static async getComments(req) {
    const { slug } = req.params;
    const fetchedComments = await Comment.findAll({
      where: { titleSlug: slug },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'createdAt', 'updatedAt', 'body']
    });
    if (!fetchedComments[0]) {
      return { errors: { body: ['no commemts found on this article'] } };
    }
    return fetchedComments;
  }

  /**
     * get a comment
     * @param {object} req - an object
     *@return {object} Return one comment on an aricle
     */
  static async getOneComment(req) {
    const { slug } = req.params;
    const { id } = req.params;
    const fetchedComment = await Comment.findOne({
      where: { titleSlug: slug, id },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image'] }],
      attributes: ['id', 'createdAt', 'updatedAt', 'body']
    });
    if (!fetchedComment) {
      return { errors: { body: ['commemt not found'] } };
    }
    return fetchedComment;
  }

  /**
     * Check if comment exist and the user who created it
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return a message explaining an error
     * @static
     */
  static async isCommentExist(req, res, next) {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).send({ errors: { body: ['commemt to be altered not found'] } });
    }
    if (comment.userId === req.user.id) {
      req.body.comment = comment.body;
      next();
      return true;
    }
    return res.status(400).send({ message: 'user alters comments they only created' });
  }

  /**
     * deletes a comment
     * @param {object} req - an object
     *@return {object} Return a message saying the commmnet is deleted
     */
  static async deleteOneComment(req) {
    const { slug } = req.params;
    const { id } = req.params;
    await Comment.destroy({ where: { titleSlug: slug, id } });
    const destroyed = await Comment.findOne({ where: { titleSlug: slug, id } });
    if (destroyed === null) {
      return { message: `comment with id ${id} have been deleted` };
    }
    return { message: `comment with id ${id} have failed to be deleted` };
  }

  /**
     * deletes a comment
     * @param {object} req - an object
     *@return {object} Return a message saying the commmnet is deleted
     */
  static async updateOneComment(req) {
    const { slug } = req.params;
    const { id } = req.params;
    const { body } = req.body;
    const { comment } = req.body;
    await Comment.update({ body: body || comment.body }, { where: { titleSlug: slug, id } });
    const updatedComment = await Comment.findOne({ where: { id } });
    return { response: updatedComment };
  }

  /**
     * Check if comment exist and the user who created it
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return a message explaining an error
     * @static
     */
  static async commentExist(req, res, next) {
    const { id } = req.params;
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).send({ errors: { body: ['commemt to be altered not found'] } });
    }
    req.params.slug = comment.titleSlug;
    next();
    return true;
  }

  /**
     * create a reply to a comment
     * @param {object} req - an object
     *@return {object} Return the created comment
     */
  static async replyComment(req) {
    const { id } = req.params;
    const { slug } = req.params;

    const replyComment = await Comment.create({
      userId: req.user.id,
      replyid: id,
      titleSlug: slug,
      body: req.body.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return replyComment;
  }

  /**
     * get all comment
     * @param {object} req - an object
     *@return {object} Return all comments on an article
     */
  static async getCommentReplies(req) {
    const { id } = req.params;
    const parentComment = await Comment.findOne({
      where: { id },
      attributes: ['id', 'createdAt', 'updatedAt', 'body']
    });
    if (!parentComment) {
      return { errors: { body: ['no comment found'] } };
    }

    const replyComments = await Comment.findAll({
      where: { replyid: id },
      attributes: ['id', 'createdAt', 'updatedAt', 'body']
    });
    if (!replyComments[0]) {
      return { errors: { body: ['no replies to this comment found'] } };
    }
    return { comment: parentComment, replies: replyComments };
  }

  /**
     * Check if comment exist and the user who created it
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return a message explaining an error
     * @static
     */
  static async isReplytExist(req, res, next) {
    const { replyId } = req.params;
    const comment = await Comment.findOne({ where: { id: replyId } });
    if (!comment) {
      return res.status(404).send({ errors: { body: ['reply to be altered not found'] } });
    }
    if (comment.userId === req.user.id) {
      req.body.reply = comment.body;
      next();
      return true;
    }
    return res.status(400).send({ message: 'user alters replies they only created' });
  }

  /**
     * deletes a reply
     * @param {object} req - an object
     *@return {object} Return a message saying the commmnet is deleted
     */
  static async deleteOneReply(req) {
    const { id } = req.params;
    const { replyId } = req.params;
    await Comment.destroy({ where: { replyid: id, id: replyId } });
    const destroyed = await Comment.findOne({ where: { id: replyId } });
    if (destroyed === null) {
      return { message: `reply with id ${replyId} have been deleted` };
    }
    return { message: `reply with id ${replyId} have failed to be deleted` };
  }

  /**
     * update a reply
     * @param {object} req - an object
     *@return {object} Return a message saying the commmnet is deleted
     */
  static async updateOneReply(req) {
    const { replyId } = req.params;
    const { id } = req.params;
    const { body } = req.body;
    const { reply } = req.body;
    await Comment.update({ body: body || reply.body }, { where: { replyid: id, id: replyId } });
    const updatedReply = await Comment.findOne({ where: { id: replyId } });
    return { response: updatedReply };
  }
}

export default CommentHelper;
