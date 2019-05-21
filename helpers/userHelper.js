import jwt from 'jsonwebtoken';
import db from '../models';
import helper from './index';
import recordHelper from './passport';
import sendEmail from './utils/mail-sender';

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
   * Update user info
   * @function updateUser
   * @param  {object} user - user info
   * @param  {object} conditions - where clauses
   * @return {object} updated user
   * @static
   */
  static async updateUser(user, conditions) {
    const newUser = await User.update(user, { where: conditions }, { logging: false });
    return newUser;
  }

  /**
   * Send verification email
   * @function sendVerificationEmail
   * @param  {string} email - user email
   * @return {boolean} has sent
   * @static
   */
  static async sendVerificationEmail(email) {
    const userToken = helper.tokenGenerator(30);

    const link = `${process.env.BASE_URL}/api/v1/users/verification?token=${userToken}&email=${email}`;
    const info = {
      email,
      subject: 'Author Heaven Email Verification',
      html: `<html>An account with your email was created to Author Heaven. Click to <a href='${link}'><strong>this link</strong></a> to validate your account`
    };
    const mailSent = await sendEmail.send(info);
    await this.updateUser({ token: userToken, isVerified: false }, { email });
    return mailSent;
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

  /**
     * List users and followers
     * @function findUserByToken
     * @param {string} jwtToken - User ID
     * @return {number} - Return id of the user or null
     * @static
     */
  static async findUserByToken(jwtToken) {
    let userId = null;
    if (jwtToken) {
      const decoded = jwt.verify(jwtToken, process.env.SECRET);
      const user = await User.findOne({ where: { id: decoded.id } });
      if (user) userId = decoded.id;
    }
    return userId;
  }
}
export default UserHelper;
