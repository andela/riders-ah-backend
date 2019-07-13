import jwt from 'jsonwebtoken';
import Joi from 'joi';
import generator from 'generate-password';
import db from '../models';
import helper from './index';
import recordHelper from './passport';
import sendEmail from './utils/mail-sender';
import ArticleHelper from './article';

const { User, Follows, Sequelize } = db;
/**
 * @exports UserHelper
 * @class UserHelper
 * @description User Helper
 * */
class UserHelper {
  /**
   * Create a new User
   * @function createNewUser
   * @param  {object} req -  a request received
   * @return {object} object of follower
   * @static
   */
  static async createNewUser(req) {
    const {
      firstName, lastName, username, email
    } = req.body;
    const generatedPassword = generator.generate({
      length: 10,
      numbers: true,
      symbols: true
    });
    const password = await helper.hashPassword(generatedPassword);
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password
    });
    await this.sendVerificationEmail(email);
    return { user, generatedPassword };
  }

  /**
   * Check if it is a Article
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static isValidInfo(req, res, next) {
    const schema = Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      username: Joi.string().required(),
      email: Joi.string()
        .email()
        .required()
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return ArticleHelper.invalidDataMessage(res, result);
    }
    next();
  }

  /**
   * Check if it is a Article
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static isValidUpdateInfo(req, res, next) {
    const schema = Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      username: Joi.string(),
      email: Joi.string().email()
    });
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return ArticleHelper.invalidDataMessage(res, result);
    }
    next();
  }

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
    let checkemail = '',
      checkusername = '';
    const emailValidatior = helper.emailValidator(req.body.email);
    if (req.body.email) {
      checkemail = await User.findOne({ where: { email: req.body.email } });
    }
    if (req.body.username) {
      checkusername = await User.findOne({
        where: { username: req.body.username.replace(/\s+/g, '').trim() }
      });
    }
    const emailUsernameValidation = helper.emailUsernamevalidator(
      checkemail,
      checkusername
    );
    if (req.body.email === undefined || req.body.email.length === 0) {
      errorMessage.push('Email is required');
    }
    if (req.body.username === undefined || req.body.username.length === 0) {
      errorMessage.push('Username is required');
    }
    if (emailValidatior !== true) {
      errorMessage.push(emailValidatior);
    }
    if (req.body.firstName === undefined) {
      if (req.body.password === undefined || req.body.password.length === 0) {
        errorMessage.push('Password is required');
      }
      const passwordValidator = helper.passwordValidator(req.body.password);
      if (passwordValidator !== true) {
        errorMessage.push(passwordValidator);
      }
    }
    if (emailUsernameValidation !== true) {
      errorMessage.push(emailUsernameValidation);
    }
    if (errorMessage.length) {
      return res
        .status(400)
        .json({ status: 400, errors: { body: errorMessage } });
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
    const newUser = await User.update(
      user,
      { where: conditions },
      { logging: false }
    );
    return newUser;
  }

  /**
   * Create a user signup validation
   * @param {string} req - request body
   * @param {string} res - response body
   * @param {string} next - Allow to proceed execution
   * @return {string} Returns an error or allow to proceed execution
   * @static
   */
  static async checkEmail(req, res, next) {
    if (req.body.email) {
      const email = await User.findOne({ where: { email: req.body.email } });
      if (email) {
        return res
          .status(400)
          .json({ status: 400, errors: 'Email already in use' });
      }
    }
    next();
  }

  /**
   * Send verification email
   * @function sendVerificationEmail
   * @param  {string} email - user email
   * @param  {string} token - token
   * @return {boolean} has sent
   * @static
   */
  static async sendVerificationEmail(email) {
    const userToken = helper.tokenGenerator(30);

    const link = `${
      process.env.FRONTEND_URL
    }/verification?token=${userToken}&email=${email}`;
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
    await Promise.all(
      users.map(async (currentUser) => {
        const conditions = {
          following: userId,
          follower: currentUser.dataValues.id
        };
        const userFollowing = await recordHelper.findRecord(
          Follows,
          conditions
        );
        currentUser.dataValues.following = !!userFollowing;
        return currentUser;
      })
    );

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

  /**
   * Return one article
   * @param {object} req - an object
   *@return {object} Return  article
   */
  static async getOneUser(req) {
    const user = await User.findOne({
      where: { username: req.params.username },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'username',
        'email',
        'bio',
        'image',
        'roles',
        'notificationSettings',
        'createdAt',
        'updatedAt'
      ]
    });
    return user;
  }

  /**
   * Check if it is valid actiomn
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static isValidAction(req, res, next) {
    const validValues = ['enable', 'disable'];
    if (validValues.indexOf(req.params.action) === -1) {
      return res
        .status(422)
        .send({ status: 422, Error: 'Only option must be enable or disable' });
    }
    next();
  }

  /**
   * Check if action is already se
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {res} Returns  response
   * @static
   */
  static async isItAlreadySet(req, res, next) {
    const { action, username } = req.params;
    const user = await User.findOne({ where: { username } });
    const isActive = action === 'enable';
    if (user) {
      if (isActive === user.isActive) {
        return res
          .status(422)
          .send({ status: 422, Error: 'Can not perform existing action' });
      }
    }
    next();
  }

  /**
   * Check if  account is active
   * @param {object} req - an object
   * @param {object} res - an object
   * @param {object} next - an object
   * @return {res} Returns  response
   * @static
   */
  static async isAccountActive(req, res, next) {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      if (!user.isActive) {
        return res.status(422).send({
          status: 422,
          Error: ' Account disabled, please contact Administrator'
        });
      }
    }
    next();
  }

  /**
   *  Return updated object
   * @param {object} req - an object
   * @param {object} res - an object
   * @return {object} Return updated data
   * @static
   */
  static async enableOrDisableUser(req) {
    const { action, username } = req.params;
    const isActive = action === 'enable';
    const updateUser = await User.update(
      {
        isActive
      },
      { where: { username }, returning: true, plain: true }
    );

    const newUserUpdated = {
      firstName: updateUser[1].firstName,
      lastName: updateUser[1].lastName,
      email: updateUser[1].email,
      isActive: updateUser[1].isActive
    };
    return newUserUpdated;
  }
}
export default UserHelper;
