import { Strategy as LocalStrategy } from 'passport-local';
import Helper from '../../helpers';
import models from '../../models';

const { User } = models;

const pass = (passport) => {
  passport.use('local_signup', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done) => {
      email = req.body.email.toLowerCase().trim();
      password = Helper.hashPassword(req.body.password);
      User.create({
        email,
        username: req.body.username.replace(/\s+/g, '').trim(),
        password
      }).then(user => done(null, user)).catch(error => done(error));
    }
  ));
  passport.use('local_signin', new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    }, (req, email, password, done) => {
      ({ email } = req.body);
      ({ password } = req.body);
      User.findOne({
        where: {
          email
        }
      }).then((user) => {
        if (!Helper.comparePassword(user.password, password)) {
          return done({ message: 'Incorrect credentials.' });
        }
        if (!user.isVerified) {
          return done({ message: 'Verify your account first' });
        }
        return done(null, user);
      }).catch(() => done({ message: 'Incorrect Credentials.' }));
    }
  ));
};

export default pass;
