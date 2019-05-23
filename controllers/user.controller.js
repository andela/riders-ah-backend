import passport from 'passport';
import db from '../models';
import passportHelper from '../helpers/passport';
import helper from '../helpers';
import userHelper from '../helpers/userHelper';

const { User } = db;
/**
 * @exports UserController
 * @class UserController
 * @description Handles social users
 * */
class UserController {
  /**
     * Create, login and Authenticate user.
     * @async
     * @param  {object} req - Request object
     * @param {object} res - Response object
     * @return {json} Returns json object
     * @static
     */
  static async socialAuth(req, res) {
    const userExist = await passportHelper.findRecord(User, {
      email: req.user.email
    });
    if (userExist) {
      const { password } = req.user;
      const isValidPassword = await helper.comparePassword(
        userExist.dataValues.password,
        password
      );
      if (isValidPassword) {
        const token = helper.generateToken(userExist.dataValues);
        return res.status(200).send({
          status: res.statusCode,
          token,
          data: { username: userExist.dataValues.username, email: userExist.dataValues.email }
        });
      }
      return res.status(422).send({
        status: res.statusCode,
        message: 'Email Already registered with other platform'
      });
    }
    const encryptedPassword = await helper.hashPassword(req.user.password);

    const newUser = await User.create({
      username: req.user.username,
      email: req.user.email,
      password: encryptedPassword,
      isVerified: true
    });
    if (!newUser) {
      return res.status(500).send('Internal error');
    }
    const token = helper.generateToken(newUser.dataValues);
    return res.status(201).send({
      status: res.statusCode,
      token,
      data: { username: newUser.dataValues.username, email: newUser.dataValues.email }
    });
  }

  /**
     * Check the environment
     * @function addUser
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async addUser(req, res) {
    passport.authenticate('local_signup', async (err, user) => {
      if (user) {
        const { email } = user.dataValues;

        const issueToken = helper.generateToken(user.dataValues);

        await userHelper.sendVerificationEmail(email);
        return res.status(201).send({
          status: 201,
          message: 'You have successfully registered. Check you email to validate you account',
          token: issueToken
        });
      }
      return res.status(500).send({ status: 500, message: 'Internal Server Error' });
    })(req, res);
  }

  /**
    * Verify account of a user
    * @function verifyAccount
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async verifyAccount(req, res) {
    const { email } = req.query;
    const userToken = { token: null, isVerified: true };
    await userHelper.updateUser(userToken, { email });
    return res.status(200).json({
      status: 200,
      message: 'Your account has successfully verified'
    });
  }

  /**
     * Resent email
     * @function resentEmail
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async resentEmail(req, res) {
    const { email } = req.body;

    await userHelper.sendVerificationEmail(email);
    return res.status(200).json({
      status: 200,
      message: 'Email was sent. Check you email account'
    });
  }

  /**
     * Create a new User
     * @function addUser
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async createUser(req, res) {
    const newUser = await userHelper.createNewUser(req);
    if (!newUser) {
      return res.status(422).send({
        status: 422, message: 'Error happened while creating user'
      });
    }
    return res.status(201).send({
      status: 201, message: `New User created and the password is ${newUser.generatedPassword}`
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return object containg user info
   */
  static async updateUser(req, res) {
    const { ...user } = req.body;
    try {
      const { username } = req.params;
      const updateUser = await User.update(
        user,
        { where: { username }, returning: true, plain: true }
      );
      if (user.email) {
        await User.update(
          { isVerified: false },
          { where: { username }, returning: true, plain: true }
        );
        await userHelper.sendVerificationEmail(user.email);
      }
      const newUserUpdated = {
        firstName: updateUser[1].firstName,
        lastName: updateUser[1].lastName,
        email: updateUser[1].email
      };
      res.status(200).send({
        status: 200,
        data: newUserUpdated
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }

  /**
     * Check the environment
     * @function loginUser
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async loginUser(req, res) {
    passport.authenticate('local_signin', (err, user) => {
      if (user) {
        const issueToken = helper.generateToken(user.dataValues);
        return res.status(200).send({ status: 200, message: 'User logged in successfully', token: issueToken });
      }
      if (err) {
        return res.status(401).send({ status: 401, err });
      }
    })(req, res);
  }

  /**
     * Get list of users
     * @function listUsers
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async listUsers(req, res) {
    const users = await userHelper.usersList(req.user.id);

    res.status(200).json({
      status: 200,
      users
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getUser(req, res) {
    const user = await userHelper.getOneUser(req);
    if (!user) {
      return res.status(404).json({
        status: res.statusCode,
        error: 'User Not found'
      });
    }
    return res.status(200).send({ user });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async enableOrDisableUser(req, res) {
    const user = await userHelper.enableOrDisableUser(req);
    return res.status(200).send({ user });
  }
}
export default UserController;
