import NotificationHelper from '../helpers/notification';

/**
 * @author Samuel Niyitanga
 * @exports ArticleController
 * @class ArticleController
 * @description Handles all related notifications functioanlities
 * */
class NotificationController {
  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async setNotification(req, res) {
    await NotificationHelper.setOption(req);
    return res.status(200).send({ Message: 'Notification option setted.' });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async unsetNotification(req, res) {
    await NotificationHelper.UnsetOption(req);

    return res.status(200).send({ Message: 'Notification successfully unsetted.' });
  }

  /**
 * @param  {object} req - Request object
 * @param {object} res - Response object
 * @returns {object} response
 *  @static
 */
  static async getNotificationByUser(req, res) {
    const notification = await NotificationHelper.getByUser(req);
    return res.status(200).send({ notification });
  }
}
export default NotificationController;
