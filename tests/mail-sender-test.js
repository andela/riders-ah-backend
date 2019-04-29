import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mailSender from '../helpers/utils/mail-sender';
import Helper from '../helpers';

chai.use(chaiAsPromised);
const testHtml = `<html>Please click on the following <strong><a href="/api/v1/auth/verify/${Helper.tokenGenerator(20)}"> link</a></strong> to verify your email</html>`;
const testSubject = 'Email verification from RidersAhBackend';

const rightEmail = {
  html: testHtml,
  subject: testSubject,
  email: 'akimanaja17@email.com'
};

const wrongEmail = {
  html: testHtml,
  subject: testSubject,
  email: 'akimanaja17@'
};

const noSubject = {
  html: testHtml,
  email: 'akimanaja17@email.com'
};

const noHtml = {
  subject: testSubject,
  email: 'akimanaja17@email.com'
};

const noEmail = {
  html: testHtml,
  subject: testSubject
};

describe('Function for sending email', () => {
  it('Should send email', (done) => {
    mailSender.send(rightEmail)
      .then((res) => {
        expect(res.message).be.equal('Sent');
        done();
      })
      .catch((error) => {
        expect(error.message).be.equal('Not sent');
        done();
      });
  });

  it('No email provided', (done) => {
    mailSender.send(noEmail)
      .then()
      .catch((error) => {
        expect(error.message).be.equal('Provide email');
        done();
      });
  });

  it('Provided wrong email', (done) => {
    mailSender.send(wrongEmail)
      .then()
      .catch((error) => {
        expect(error.message).be.equal('Email is invalid');
        done();
      });
  });

  it('No subject provided', (done) => {
    mailSender.send(noSubject)
      .then()
      .catch((error) => {
        expect(error.message).be.equal('Provide subject');
        done();
      });
  });

  it('No html content provided', (done) => {
    mailSender.send(noHtml)
      .then()
      .catch((error) => {
        expect(error.message).be.equal('No html provided');
        done();
      });
  });
});
