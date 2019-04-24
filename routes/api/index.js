import express from 'express';
import auth from './auth/auth';
import user from './auth/users';
import resetPassword from './resetPassword/resetPassword.js';

const router = express.Router();


router.use('/users', user);
router.use('/login', auth);
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

router.use('/user', resetPassword);

export default router;
