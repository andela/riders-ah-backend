import FacebookStrategy from 'passport-facebook';
import GoogleStrategy from 'passport-google-oauth2';
import TwitterStrategy from 'passport-twitter';
import passportHelper from '../../helpers/passport';

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/login/facebook/callback`,
    profileFields: ['id', 'emails', 'name']
  },
  passportHelper.verifyCallback
);

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/login/google/callback`
  },
  passportHelper.verifyCallback
);

const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: `${process.env.BASE_URL}/api/v1/login/twitter/callback`,
    includeEmail: true,
    profileFields: ['id', 'emails', 'name']
  },
  passportHelper.verifyCallback
);


export { facebookStrategy, googleStrategy, twitterStrategy };
