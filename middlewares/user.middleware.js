import models from '../models';
import recordHelper from '../helpers/passport';

const { User, Follows } = models;
/**
 * @class UserHelper
 * @description Helper for User
 * */
class userMiddleware {
  /**
   * Check if the user id is valid
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - calls the next middleware
   * @return {json} Returns json object
   * @static
   */
  static async isUserValid(req, res, next) {
    const { username } = req.params;

    const userInfo = await recordHelper.findRecord(User, { username });
    if (!userInfo) {
      return res.status(404).json({
        status: 404,
        errors: { body: ['User not found'] }
      });
    }
    if (userInfo.dataValues.id === req.user.id) {
      return res.status(400).json({
        status: 400,
        errors: { body: ['You cannot follow yourself'] }
      });
    }
    req.body.followId = userInfo.dataValues.id;
    return next();
  }

  /**
   * Check if the user id is valid
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - calls the next middleware
   * @return {json} Returns json object
   * @static
   */
  static async isAllowed(req, res, next) {
    const { username } = req.params;

    const userInfo = await recordHelper.findRecord(User, { username });
    if (!userInfo) {
      return res.status(404).json({
        status: 404,
        errors: { body: ['User not found'] }
      });
    }
    if (userInfo.dataValues.id !== req.user.id) {
      return res.status(401).json({
        status: 401,
        errors: { body: ['You are not allowed to view other\'s profile'] }
      });
    }
    return next();
  }

  /**
   * Check if the user id is valid
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - calls the next
   * @return {json} Returns json object
   * @static
   */
  static async isNotFollowingUser(req, res, next) {
    const { followId } = req.body;
    const { id } = req.user;

    const follower = await recordHelper.findRecord(Follows, { following: id, follower: followId });
    if (follower) {
      return res.status(400).json({
        status: 409,
        errors: { body: ['You have already followed the user'] }
      });
    }
    return next();
  }

  /**
   * Check if the user id is valid
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @param {function} next - calls the next
   * @return {json} Returns json object
   * @static
   */
  static async isFollowingUser(req, res, next) {
    const { followId } = req.body;
    const { id } = req.user;

    const follower = await recordHelper.findRecord(Follows, {
      following: id, follower: followId
    });
    if (!follower) {
      return res.status(400).json({
        status: 404,
        errors: { body: ['User is not in your followers'] }
      });
    }
    return next();
  }
}

export default userMiddleware;
