import commentHelper from '../helpers/commentHelper';

/**
 * reset password middleware
 * @author Kabalisa fiston
 * @class
 * @classdesc Comments
 */
class Comments {
  /**
   * @function addComment
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with the type of comment created and time
   * range between the last comment
  */
  static async addComment(req, res) {
    const result = await commentHelper.createComment(req);
    return res.status(201).send(result);
  }

  /**
   * @function getComments
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with all comments on an article and their author
  */
  static async getComments(req, res) {
    const allComments = await commentHelper.getComments(req);
    return res.status(200).send({ comments: allComments });
  }

  /**
   * @function getOneComment
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async getOneComment(req, res) {
    const oneComment = await commentHelper.getOneComment(req);
    return res.status(200).send({ comment: oneComment });
  }

  /**
   * @function deleteOneComment
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async deleteOneComment(req, res) {
    const result = await commentHelper.deleteOneComment(req);
    return res.status(200).send(result);
  }

  /**
   * @function updateOneComment
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async updateOneComment(req, res) {
    const result = await commentHelper.updateOneComment(req);
    return res.status(201).send(result);
  }

  /**
   * @function replyComment
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with the type of comment created and time
   * range between the last comment
  */
  static async replyComment(req, res) {
    const result = await commentHelper.replyComment(req);
    const replycomment = result.toJSON();
    return res.status(201).send(replycomment);
  }

  /**
   * @function getCommentReplies
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with all replies on a comment and the comment
  */
  static async getCommentReplies(req, res) {
    const result = await commentHelper.getCommentReplies(req);
    return res.status(200).send(result);
  }

  /**
   * @function deleteOneReply
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async deleteOneReply(req, res) {
    const result = await commentHelper.deleteOneReply(req);
    return res.status(200).send(result);
  }

  /**
   * @function updateOneReply
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async updateOneReply(req, res) {
    const result = await commentHelper.updateOneReply(req);
    return res.status(201).send(result);
  }
}

export default Comments;
