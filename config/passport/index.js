/* eslint-disable require-jsdoc */
import passport from 'passport';
import { facebookStrategy, googleStrategy, twitterStrategy } from './strategy';
import { facebookTestStrategy, twitterTestStrategy, googleTestStrategy } from './testStrategy';

class Strategy {
  constructor() {
    this.facebookStrategy = passport.use(facebookStrategy);
    this.googleStrategy = passport.use(googleStrategy);
    this.twitterStrategy = passport.use(twitterStrategy);
    this.facebookTestStrategy = passport.use(facebookTestStrategy);
    this.twitterTestStrategy = passport.use(twitterTestStrategy);
    this.googleTestStrategy = passport.use(googleTestStrategy);
    this.strategy = null;
  }

  strategyTouse(strategy) {
    if (process.env.NODE_ENV === 'test') {
      this.strategy = `${strategy}-test`;
    } else {
      this.strategy = `${strategy}`;
    }
    return this.strategy;
  }
}
export default Strategy;
