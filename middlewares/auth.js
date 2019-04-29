import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;

const Auth = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    User.findOne({
      where: { email: decoded.email }
    }).then((user) => {
      if (!user) {
        return res.status(401).send({ status: 401, error: 'The token you provided is invalid' });
      }
      req.user = {
        id: decoded.id,
      };
      next();
    }).catch(error => res.status(401).send({ ERROR: error }));
  } catch (error) {
    return res.status(401).send({ status: 401, error });
  }
  return true;
};

export default Auth;
