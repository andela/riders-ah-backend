import models from '../models';
import helper from './passport';

const { Follows, User } = models;

/**
 * @class UserHelper
 * @description Helper for User
 * */
class UserHelper {
  /**
   * Get one follower of user
   * @function getUserFollower
   * @param  {number} userId - ID of the user
   * @param  {number} followId - ID of follower
   * @return {object} object of follower
   * @static
   */
  static async getUserFollower(userId, followId) {
    const follow = await Follows.findOne({
      where: { following: userId, follower: followId }
    });
    return follow;
  }

  /**
   * Get all followers of user
   * @function userFollowers
   * @param  {number} userId - ID of user
   * @return {object} object of follower
   * @static
   */
  static async userFollowers(userId) {
    const followers = await Follows.findAll({
      where: { follower: userId },
      attributes: ['following']
    });
    return followers;
  }

  /**
   * Get all followings of user
   * @function userFollowings
   * @param  {number} userId - ID of user
   * @return {object} object of following
   * @static
   */
  static async userFollowings(userId) {
    const followings = await Follows.findAll({
      where: { following: userId },
      attributes: ['follower']
    });
    return followings;
  }

  /**
   * Save a follower
   * @function saveFollower
   * @param  {object} userInfo - Request object
   * @return {object} Returns follow
   * @static
   */
  static async saveFollower(userInfo) {
    const follow = await Follows.create({
      following: userInfo.userId,
      follower: userInfo.followId
    });

    return follow.dataValues;
  }

  /**
   * Check if the user request is to follow or unfollow
   * @param  {array} userIds - Request object
   * @param  {string} userType - Request object
   * @return {array} Returns array of users with their names
   * @static
   */
  static async serializeUsers(userIds, userType) {
    const type = userType === 'follower' ? 'follower' : 'following';
    const userList = [];
    await Promise.all(userIds.map(async (currentId) => {
      const userInfo = await helper.findRecord(User, currentId[type]);
      userList.push({
        id: currentId[type],
        username: userInfo.dataValues.username,
        bio: userInfo.dataValues.bio,
        image: userInfo.dataValues.image,
        email: userInfo.dataValues.email,
        notificationSettings: userInfo.dataValues.notificationSettings
      });
    }));
    return userList;
  }
}

export default UserHelper;
