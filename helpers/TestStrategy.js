import passport from 'passport';
import user from './mockUser';

let currentUser;

/**
 * Class representing a strategy
 * @extends passport.Strategy
 */
class Strategy extends passport.Strategy {
  /**
   * @constructor
   * @param {string} name - the name of the strategy
   * @param {function} strategyCallback - the function to handle the callback from the strategy
   */
  constructor(name, strategyCallback) {
    switch (name) {
      case undefined:
        throw new TypeError('No strategy Name');
      case 'facebook-test':
        currentUser = user.facebook;
        break;
      case 'google-test':
        currentUser = user.google;
        break;
      case 'twitter-test':
        currentUser = user.twitter;
        break;
      default:
        break;
    }

    super(name, strategyCallback);
    this.name = name;
    this.user = currentUser;
    this.cb = strategyCallback;
  }

  /**
   * @param {object}  req - This should contain the request body
   * @returns {object} - returns the user that has been authenticated
   */
  authenticate(req) {
    if (req.body.token === this.user.token) {
      this.cb(null, null, this.user, (error, userInfo) => {
        this.success(userInfo);
      });
    }
  }
}

export default Strategy;
