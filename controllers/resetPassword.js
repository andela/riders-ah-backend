import model from '../models';
import Helper from '../helpers/index';
import mailSender from '../helpers/utils/mail-sender';
/**
 * reset password middleware
 * @author Kabalisa fiston
 * @class
 * @classdesc Password
 */
class Password {
  /**
   * @function resetPassword
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} Object with a RESULT property or ERROR property
  */
  static resetPassword(req, res) {
    const { User } = model;
    const { newPassword } = req.body;
    const { confirmNewPassword } = req.body;
    if (newPassword.trim() !== confirmNewPassword.trim()) {
      return res.status(401).send({ message: 'new password and confirm new password must be equal' });
    }
    const hash = Helper.hashPassword(newPassword);
    User.update({ password: hash }, { where: { id: req.user.id } })
      .then(result => res.status(201).send({ RESULT: result }))
      .catch(error => res.status(400).send({ ERROR: error }));
  }

  /**
 * @function resetPasswordEmail
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} Object with properties Result and ERROR
 */
  static resetPasswordEmail(req, res) {
    const { User } = model;
    const { email } = req.body;
    User.findOne({
      where: {
        email
      }
    }).then((user) => {
      if (!user) {
        return res.status(400).send({ message: `no user with email ${email} found` });
      }
      const userDetails = {
        id: user.id
      };
      const token = Helper.generateToken(userDetails);
      const info = { email, subject: 'Authorshaven Reset Password', html: `<html>User with the following email <strong>${email}</strong> has required to reset their password please copy this token <strong>${token}</strong></html>` };
      mailSender.send(info).then(result => res.status(200).send({ Result: result, Token: token })).catch(() => res.status(400).send({ ERROR: 'issue with sending email' }));
    }).catch(error => res.status(400).send({ ERROR: error }));
  }
}

export default Password;
