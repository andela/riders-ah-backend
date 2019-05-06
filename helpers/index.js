import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
/**
 * @exports Helper
 * @class Helper
 * @description Helps to generate token and passwor hashing
 * */
class Helper {
  /**
     * Check the environment
     * @function generateToken
     * @param  {object} userinfo - accept object with user info
     * @return {string} Returns strategy
     */
  static generateToken(userinfo) {
    const Issuetoken = jwt.sign(userinfo,
      process.env.SECRET, { expiresIn: '1d' });
    return Issuetoken;
  }

  /**
     * Check the environment
     * @function hashPassword
     * @param  {string} password - user password
     * @return {string} Returns hashedPassword
     */
  static hashPassword(password) {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return hashedPassword;
  }

  /**
     * Check the environment
     * @function comparePassword
     * @param  {string} passwordHash - a hashed  password
     * @param  {string} password - a user  password
     * @return {boolean} comparedPassword -Returns true if they are matching or false
     */
  static comparePassword(passwordHash, password) {
    const comparedPassword = bcrypt.compareSync(password, passwordHash);
    return comparedPassword;
  }
}

export default Helper;
