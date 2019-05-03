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
}
export default UserController;
