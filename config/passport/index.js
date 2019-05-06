import passport from 'passport';
import { facebookStrategy, googleStrategy, twitterStrategy } from './strategy';
import { facebookTestStrategy, twitterTestStrategy, googleTestStrategy } from './testStrategy';
/**
 * @exports Strategy
 * @class Strategy
 * @description Handles all strategies
 * */
class Strategy {
  /**
     * Initialiaze all passport
     */
  constructor() {
    this.facebookStrategy = passport.use(facebookStrategy);
    this.googleStrategy = passport.use(googleStrategy);
    this.twitterStrategy = passport.use(twitterStrategy);
    this.facebookTestStrategy = passport.use(facebookTestStrategy);
    this.twitterTestStrategy = passport.use(twitterTestStrategy);
    this.googleTestStrategy = passport.use(googleTestStrategy);
    this.strategy = null;
  }

  /**
     * Check the environment
     * @function strategyTouse
     * @param  {string} strategy - accept social network to use
     * @return {string} Returns strategy
     */
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
