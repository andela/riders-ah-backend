import Helper from '..';

const client = Helper.mailTransport();

/**
 * @exports mailSender
 */
const mailSender = {
  /**
   *
   * @author Jean dAmour
   * @param {object} infos .
   * @returns {Promise} response from nodemailer
   */
  send(infos) {
    const sendEmailPromise = new Promise((resolve, reject) => {
      if (infos.email === undefined || infos.email === '') reject(new Error('Provide email'));
      else if (!Helper.validateEmail(infos.email)) reject(new Error('Email is invalid'));
      else if (infos.subject === undefined || infos.subject === '') reject(new Error('Provide subject'));
      else if (!infos.html) reject(new Error('No html provided'));

      infos.email = infos.email.toLowerCase();
      const email = {
        from: process.env.APP_EMAIL,
        to: infos.email,
        subject: infos.subject,
        html: infos.html
      };

      client.sendMail(email, (err, info) => {
        const errors = { message: 'Not sent', error: err };
        const successes = { message: 'Sent', data: info };
        if (err) reject(errors);
        resolve(successes);
      });
    });
    return sendEmailPromise;
  }
};

export default mailSender;
