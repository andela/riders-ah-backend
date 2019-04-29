import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import stubTransport from 'nodemailer-stub-transport';
import sgTransport from 'nodemailer-sendgrid-transport';

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

  /**
* @description function to generate token
* @function tokenGenerator
* @param { number } tokenLength
* @returns { string } returns string of tokenLength length
* */
  static tokenGenerator(tokenLength) {
    const token = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < tokenLength; i += 1) {
      token.push(chars[this.getRandomInt(0, chars.length - 1)]);
    }
    return token.join('');
  }

  /**
* @param { number } min
* @param { number } max
* @return { number } return random number between min and max
*/
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
* @description Function to chack whether email is valid
* @function validateEmail
* @param { string } email
* @return { boolean } return true or false
*/
  static validateEmail(email) {
    const reg = /\S+@\S+\.\S+/;
    return reg.test(email.toLowerCase());
  }

  /**
* @function mailTransport
* @return { * } return transport
*/
  static mailTransport() {
    const options = {
      auth: {
        api_key: process.env.SENDGRID_API_KEY,
      }
    };

    const transport = process.env.NODE_ENV === 'test' ? stubTransport() : sgTransport(options);
    return nodemailer.createTransport(transport);
  }
}

export default Helper;
