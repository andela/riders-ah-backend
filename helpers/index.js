/* eslint-disable require-jsdoc */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();
class Helper {
  static generateToken(userinfo) {
    const Issuetoken = jwt.sign(userinfo,
      process.env.SECRET, { expiresIn: '1d' });
    return Issuetoken;
  }

  static hashPassword(password) {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    return hashedPassword;
  }

  static comparePassword(passwordHash, password) {
    const comparedPassword = bcrypt.compareSync(password, passwordHash);
    return comparedPassword;
  }
}

export default Helper;
