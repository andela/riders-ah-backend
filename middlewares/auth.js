
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User, DroppedTokens } = models;

const Auth = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log('================== token', token);
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log('================== decoded', decoded);
    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).send({ status: 401, error: 'The token you provided is invalid' });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .send({ status: 401, error: 'You have to validate your account first' });
    }
    const droppedToken = await DroppedTokens.findOne({
      where: {
        token
      },
      logging: false
    });
    if (droppedToken) {
      return res.status(401).send({ status: 401, error: 'You have logged out' });
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
