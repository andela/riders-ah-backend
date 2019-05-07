import passport from 'passport';
import db from '../models';
import passportHelper from '../helpers/passport';
import helper from '../helpers';

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
      password: encryptedPassword
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
    passport.authenticate('local_signup', (err, user) => {
      if (user) {
        const userData = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        const issueToken = helper.generateToken(user.dataValues);
        return res.status(201).send({
          status: 201, message: 'User added successfully', token: issueToken, user: userData
        });
      }
      return res.status(500).send({ status: 500, message: 'Internal Server Error' });
    })(req, res);
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
}
export default UserController;
