import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;

const Auth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).send({ status: 401, error: 'The token you provided is invalid' });
    }
    if (!user.isVerified) {
      return res.status(401).send({ status: 401, error: 'You have to validate your account first' });
    }
    req.user = {
      id: decoded.id
    };
    next();
  } catch (error) {
    return res.status(401).send({ status: 401, error });
  }
  return true;
};

export default Auth;
