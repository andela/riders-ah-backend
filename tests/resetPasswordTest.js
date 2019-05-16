import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import model from '../models';

chai.should();
chai.use(chaiHttp);
// reser password via email test
describe('should reset password with email', () => {
  let token;
  // create demo user
  before(async () => {
    const { User } = model;
    await User.create({
      username: 'Innocent Fiston Kabalisa',
      email: 'someone@somewhere.com',
      bio: 'TIA',
      image: 'dajhgvf',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  it('send reset password email', (done) => {
    const data = {
      email: 'someone@somewhere.com'
    };
    chai
      .request(app)
      .post('/api/v1/users/resetPasswordEmail')
      .send(data)
      .end((err, res) => {
        token = res.body.Token;
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.Result.should.have.property('message').eql('Sent');
        done();
      });
  });
  it('should send reset email to existing email in database', (done) => {
    const data = { email: 'some@somewhere.com' };
    chai
      .request(app)
      .post('/api/v1/users/resetPasswordEmail')
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`no user with email ${data.email} found`);
        done();
      });
  });
  it('newPassword and confirmNewPassword must be equal', (done) => {
    const data = {
      newPassword: 'password',
      confirmNewPassword: 'passwor'
    };
    chai
      .request(app)
      .post('/api/v1/users/resetPassword')
      .set('authorization', token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have
          .property('message')
          .eql('new password and confirm new password must be equal');
        done();
      });
  });
  it('should reset the password to newPassword only if it is valid', (done) => {
    const data = {
      newPassword: 'password!',
      confirmNewPassword: 'password!'
    };
    chai
      .request(app)
      .post('/api/v1/users/resetPassword')
      .set('authorization', token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should reset the password to newPassword', (done) => {
    const data = {
      newPassword: 'Password@123!',
      confirmNewPassword: 'Password@123!'
    };
    chai
      .request(app)
      .post('/api/v1/users/resetPassword')
      .set('authorization', token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Your password has been updated successfuly');
        done();
      });
  });
  after(async () => {
    const { User } = model;
    await User.destroy({
      where: { email: 'someone@somewhere.com' }
    });
  });
});
