/**
 * @exports PassportHelper
 * @class PassportHelper
 * @description Handles Passport user data
 * */
class PassportHelper {
  /**
   * Return object with users data from social
   * @async
   * @param  {string} accessToken - Access token from social
   * @param  {string} refreshToken - Refresh token from social
   * @param  {object} profile - user profile
   * @param {function} done - Return data
   * @return {object} return user data
   * @static
   */
  static async verifyCallback(accessToken, refreshToken, profile, done) {
    let user;
    try {
      const userName = profile.username || profile.name.familyName || profile.name.givenName;
      const email = profile.emails[0].value;
      user = {
        username: userName || email.substring(0, email.indexOf('@')),
        email,
        password: profile.id,
        provider: profile.provider,
        image: profile.photos[0].value || null
      };
      done(null, user);
    } catch (error) {
      done(error, false, error.message);
    }
  }

  /**
   * Return specific record from database
   * @async
   * @param  {model} model - model
   * @param {search} search - Return data
   * @return {exiting} return user data
   * @static
   */
  static async findRecord(model, search) {
    const existing = await model.findOne({ where: search });
    return existing;
  }
}
export default PassportHelper;
