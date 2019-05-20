import db from '../models';
import helper from './index';
import recordHelper from './passport';

const { User, Follows, Sequelize } = db;
/**
 * @exports UserHelper
 * @class UserHelper
 * @description User Helper
 * */
class UserHelper {
  /**
     * Create a user signup validation
     * @param {string} req - request body
     * @param {string} res - response body
     * @param {string} next - Allow to proceed execution
     * @return {string} Returns an error or allow to proceed execution
     * @static
     */
  static async addUser(req, res, next) {
    const errorMessage = [];
    let checkemail = '', checkusername = '';
    const emailValidatior = helper.emailValidator(req.body.email);
    if (req.body.email) {
      checkemail = await User.findOne({ where: { email: req.body.email } });
    }
    if (req.body.username) {
      checkusername = await User.findOne({ where: { username: req.body.username.replace(/\s+/g, '').trim() } });
    }
    const emailUsernameValidation = helper.emailUsernamevalidator(checkemail, checkusername);
    if (req.body.email === undefined || req.body.email.length === 0) { errorMessage.push('Email is required'); }
    if (req.body.username === undefined || req.body.username.length === 0) { errorMessage.push('Username is required'); }
    if (req.body.password === undefined || req.body.password.length === 0) { errorMessage.push('Password is required'); }
    if (emailValidatior !== true) { errorMessage.push(emailValidatior); }
    const passwordValidator = helper.passwordValidator(req.body.password);
    if (passwordValidator !== true) { errorMessage.push(passwordValidator); }
    if (emailUsernameValidation !== true) { errorMessage.push(emailUsernameValidation); }
    if (errorMessage.length) {
      return res.status(400).json({ status: 400, errors: { body: errorMessage } });
    }
    next();
  }

  /**
     * List users and followers
     * @function usersList
     * @param {string} userId - User ID
     * @return {string} - Returns an array of users
     * @static
     */
  static async usersList(userId) {
    const users = await User.findAll({
      where: { id: { [Sequelize.Op.ne]: userId } },
      attributes: ['id', 'username', 'bio', 'image']
    });
    await Promise.all(users.map(async (currentUser) => {
      const conditions = {
        following: userId, follower: currentUser.dataValues.id
      };
      const userFollowing = await recordHelper.findRecord(Follows, conditions);
      currentUser.dataValues.following = !!userFollowing;
      return currentUser;
    }));

    return users;
  }
}
export default UserHelper;
