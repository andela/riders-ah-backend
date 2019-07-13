import messageHelper from '../helpers/messageHelper';

/**
 * @class Message
 */
class Message {
  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   */

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   */
  static async getMessages(req, res) {
    try {
      const messages = await messageHelper.getChats();
      return res.status(200).send({
        status: 200,
        messages
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
export default Message;
