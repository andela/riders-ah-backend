import db from '../models';
import passportHelper from './passport';
import notificationHelper from './notification';
import userHelper from './user.helper';

const { User, Notification } = db;
/**
 * @author Samuel Niyitanga
 * @exports NotificationEvent
 * @class NotificationEvent
 * @description Notification Event Hanler
 * */
class NotificationEvent {
  /**
   * method to create and send anotification.
   * @param {object} info - an object containing authorID, title and slug
   * @returns {none} no return
   */
  static async notificationEmitter(info) {
    const author = await passportHelper.findRecord(User, info.authorId);
    const results = await userHelper.userFollowers(info.authorId);
    const followers = await userHelper.serializeUsers(results, 'following');
    const followersWithEmailOption = notificationHelper.getfollowersWithEmailOption(followers);
    const followersWithInAppOption = notificationHelper
      .getfollowersWithAppOption(followers);
    followersWithEmailOption.forEach((follower) => {
      if (follower.notification.indexOf('follower') !== -1) {
        notificationHelper
          .sendEmailToFollowers(follower.email, author.username, info.title);
        return;
      }
      if (follower.notification.indexOf('articleFavorite') !== -1) {
        notificationHelper
          .sendEmailOnInteraction(follower.email, author.username, info.title);
      }
    });
    const notifications = notificationHelper
      .inAppNotifications(followersWithInAppOption, info.title, author.username);
    await Notification
      .bulkCreate(notifications, {
        returning: true
      });
  }
}
export default NotificationEvent;
