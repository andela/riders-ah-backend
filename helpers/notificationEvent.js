import db from '../models';
import passportHelper from './passport';
import notificationHelper from './notification';
import userHelper from './user.helper';
import ArticleHelper from './article';

const { User, Notification, Article } = db;
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
  static async sendOnArticlePublish(info) {
    const author = await passportHelper.findRecord(User, info.authorId);
    const results = await userHelper.userFollowers(info.authorId);
    const followers = await userHelper.serializeUsers(results, 'following');
    const followersWithEmailOption = notificationHelper.getfollowersWithEmailOption(followers);
    const followersWithInAppOption = notificationHelper
      .getfollowersWithAppOption(followers);
    followersWithEmailOption.forEach((follower) => {
      if (follower.notificationSettings.indexOf('onfollowPublish') !== -1) {
        notificationHelper
          .sendEmailToFollowers(follower.email, author.username, info.title);
      }
    });
    const notifications = notificationHelper
      .inAppNotifications(followersWithInAppOption, info.title, author.username);
    await Notification
      .bulkCreate(notifications, {
        returning: true
      });
  }

  /**
       * Emit event on article interaction
       * @param {object} info  - an object of  data
       * @return {null} - return null
       */
  static async sendOnArticleInterraction(info) {
    const result = await ArticleHelper.getLikes(info.req);
    const article = await Article.findAll({
      where: { slug: info.comment.titleSlug },
      include: [{ model: User, as: 'author', attributes: ['username', 'bio', 'image', 'email', 'notificationSettings'] }],
    });
    const users = [];
    result.forEach((like) => {
      users.push(like.author);
    });
    const followersWithEmailOption = notificationHelper.getfollowersWithEmailOption(users);
    const followersWithInAppOption = notificationHelper
      .getfollowersWithAppOption(users);
    followersWithEmailOption.forEach((user) => {
      if (user.notificationSettings.indexOf('onArticleFavoritedInteraction') !== -1) {
        notificationHelper
          .sendEmailOnInteraction(user.email, article[0].author.username, article[0].title);
      }
    });
    const notifications = notificationHelper
      .inAppNotifications(followersWithInAppOption, article[0].title, article[0].author.username);
    await Notification
      .bulkCreate(notifications, {
        returning: true
      });
  }
}
export default NotificationEvent;
