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
    return res.status(201).send({ comment: result });
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
   * @function getCommentHistories
   * @param {Object} req
   * @param {Object} res
   * @returns {array} An array of comments histories
  */
  static async getCommentHistories(req, res) {
    const commentId = req.params.id;

    const histories = await commentHelper.getCommentsHistories(commentId);
    return res.status(200).json({
      status: 200,
      commentsHistories: histories.rows
    });
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

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async reactOnComment(req, res) {
    const result = await commentHelper.createFeedback(req);
    const feedbackCreated = result.toJSON();
    return res.status(201).send({ feedback: feedbackCreated });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getLikes(req, res) {
    const { numberOfLikes } = req.body;
    const result = await commentHelper.getLikes(req);
    return res.status(200).send({ likes: result, count: numberOfLikes });
  }

  /**
   * @function deleteAFeedback
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with one comment on an article and its author
  */
  static async deleteFeedback(req, res) {
    await commentHelper.deleteFeedback(req);
    return res.send({ message: { body: ['Deleted successfully'] } });
  }
}

export default Comments;
