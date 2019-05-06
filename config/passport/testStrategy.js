import passportHelper from '../../helpers/passport';
import TestStrategy from '../../helpers/TestStrategy';

const facebookTestStrategy = new TestStrategy('facebook-test', passportHelper.verifyCallback);
const twitterTestStrategy = new TestStrategy('twitter-test', passportHelper.verifyCallback);
const googleTestStrategy = new TestStrategy('google-test', passportHelper.verifyCallback);

export { facebookTestStrategy, twitterTestStrategy, googleTestStrategy };
