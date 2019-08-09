import db from '../models';
import mailSender from './utils/mail-sender';

const {
  User, Notification
} = db;

/**
 * @author Samuel Niyitanga
 * @exports NotificationHelper
 * @class NotificationHelper
 * @description Notification Helper
 * */
class NotificationHelper {
  /**
     * Set notification option
     * @param {object} req - an object
     * @return {object} Returns response
     * @static
     */
  static async setOption(req) {
    const { option } = req.params;
    const user = await User.findOne({ where: { id: req.user.id } });
    const notifsArray = user.dataValues.notificationSettings;
    notifsArray.push(option);
    const optionSet = await user.update({ notificationSettings: notifsArray });
    return optionSet;
  }

  /**
     * Unset notification option
     * @param {object} req - an object
     * @return {object} Returns response
     * @static
     */
  static async UnsetOption(req) {
    const { option } = req.params;
    const user = await User.findOne({ where: { id: req.user.id } });
    const notifsArray = user.dataValues.notificationSettings;
    const optionIndex = notifsArray.indexOf(option);
    notifsArray.splice(optionIndex, 1);
    const optionUnsetted = await user.update({ notificationSettings: notifsArray });
    return optionUnsetted;
  }

  /**
     * Check if option exists
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return false
     * @static
     */
  static async isOptionAvailable(req, res, next) {
    const user = await User.findOne({ where: { id: req.user.id } });
    const index = user.dataValues.notificationSettings
      .findIndex(notification => notification === req.params.option);
    if (index !== -1) {
      return res.status(422).send({ status: 422, Error: 'You already have this Option set' });
    }
    next();
  }

  /**
     * Check if option exists
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return false
     * @static
     */
  static async isOptionIn(req, res, next) {
    const user = await User.findOne({ where: { id: req.user.id } });
    const index = user.dataValues.notificationSettings
      .findIndex(notification => notification === req.params.option);
    if (index === -1) {
      return res.status(422).send({ status: 422, Error: 'You don\'t have this Option set' });
    }
    next();
  }

  /**
     * Check if it is valid params
     * @param {object} req - an object
     * @param {object} res - an object
     * @param {object} next - an object
     * @return {boolean} Returns if true if it is valid else return false
     * @static
     */
  static isValidOption(req, res, next) {
    const validValues = ['receiveEmail', 'receiveInApp', 'onfollowPublish', 'onArticleFavoritedInteraction'];
    if (validValues.indexOf(req.params.option) === -1) {
      return res.status(422).send({ status: 422, Error: 'Only option must be receiveEmail, receiveInApp, onfollowPublish or onArticleFavoritedInteraction' });
    }
    next();
  }

  /**
   * @param {object} followers
   * @returns {object} return emails
   */
  static getfollowersWithEmailOption(followers) {
    const followersWithEmails = [];
    followers.forEach((follower) => {
      if (follower.notificationSettings.indexOf('receiveEmail') !== -1) {
        followersWithEmails.push(follower);
      }
    });
    return followersWithEmails;
  }

  /**
   * @param {object} followers
   * @param {integer} authorId
   * @param {string} articleSlug
   * @returns {object} return followers
   */
  static getfollowersWithAppOption(followers) {
    const followersWithApp = [];
    followers.forEach((follower) => {
      if (follower.notificationSettings.indexOf('receiveInApp') !== -1) {
        followersWithApp.push(follower);
      }
    });
    return followersWithApp;
  }

  /**
   *  Send notification email when users they follow publish new articles
   * @param {string } email - A user aemail
   * @param {string} author
   * @param {string} title
   * @returns {object} return email to send
   */
  static sendEmailToFollowers(email, author, title) {
    return mailSender.send({
      email,
      subject: `${author} created a new article`,
      html: `<html>You can check <strong>${title}</strong> created on Author Haven</html>`
    });
  }

  /**
   *  Send notification email when articles they favorited have new interaction
   * @param {string } email - A user aemail
   * @param {string} user - People who interacted with an article
   * @param {string} title
   * @returns {object} return email to send
   */
  static sendEmailOnInteraction(email, user, title) {
    return mailSender.send({
      email,
      subject: `A new comment on Article by  ${user} on Author Haven`,
      html: `<html>On Author Haven <strong>${title}</strong> had a new comment </html>`
    });
  }

  /**
   * @param {object}  followers followers object
   * @param {string}  title
   * @param {string}  username
   * @returns {array} return array of notification object
   */
  static inAppNotifications(followers, title, username) {
    const notifications = [];
    followers.forEach((follower) => {
      if (follower.notificationSettings.indexOf('onfollowPublish') !== -1) {
        const singleNotification = {
          userId: follower.id,
          notificationMessage: `New article called ${title} was created by ${username} `,
        };
        notifications.push(singleNotification);
        return;
      }
      if (follower.notificationSettings.indexOf('onArticleFavoritedInteraction') !== -1) {
        const singleNotification = {
          userId: follower.id,
          notificationMessage: `Reaction on Article  called ${title}  by ${username} `,
        };
        notifications.push(singleNotification);
      }
    });
    return notifications;
  }

  /**
       * Return one article
       * @param {object} req - an object
       *@return {object} Return  article
       */
  static async getByUser(req) {
    const article = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'bio', 'image']
      }]
    });
    return article;
  }
}
export default NotificationHelper;
