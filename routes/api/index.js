import express from 'express';
import auth from './auth/auth';
import user from './auth/users';
import roles from './roles/roles';
import resetPassword from './resetPassword/resetPassword.js';
import users from './profile/profile';
import notifications from './auth/notification';
import article from './article/articles';
import comment from './comment/comment';
import likes from './comment/like';
import userRoute from './user/user.route';
import message from './message/message';

const router = express.Router();

router.use('/', notifications);
router.use('/users', user);
router.use('/users', userRoute);
router.use('/users/roles', roles);
router.use('/login', auth);
router.use('/articles', article);
router.use('/article', comment);
router.use('/comments', likes);
router.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce((errors, key) => {
        errors[key] = err.errors[key].message;
        return errors;
      }, {})
    });
  }
  return next(err);
});
router.use('/profiles', users);
router.use('/users', resetPassword);
router.use('/messages', message);

export default router;
