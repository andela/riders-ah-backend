import model from '../models';

const { Message, User } = model;

/**
 *  @export messageHelper
 * @class messageHelper
 * @description message Helper
 */
class messageHelper {
  /**
   * create a message
   * @param {object} req an object
   * @param {object} res
   * @return {object} res an object
   */

  /**
   * read all past messages
   * @param {object} req an object
   * @return {object} res an object
   */
  static async getChats() {
    const chats = await Message.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ],
      attributes: ['message', 'createdAt']
    });
    return chats;
  }
}
export default messageHelper;
