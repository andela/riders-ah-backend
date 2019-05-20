import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';
import models from '../models';
import helper from '../helpers';

const { User } = models;

chai.use(chaiHttp);

let userToken;
const newUser = {
  username: 'TestUser', email: 'testuser@email.com', password: helper.hashPassword('user@password1')
};
const newUser2 = {
  username: 'TestUser2', email: 'testuser1@email.com', password: helper.hashPassword('user@password')
};

const userLogin = {
  email: 'testuser@email.com', password: 'user@password1'
};

describe('GET /api/v1/users, List users', () => {
  before(async () => {
    await User.create(newUser, { logging: false });
    await User.create(newUser2, { logging: false });
  });
  it('Login user', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(userLogin)
      .end((err, res) => {
        userToken = res.body.token;
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('User should be logged in', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .end((err, res) => {
        expect(res.body).to.have.status(401);
        done();
      });
  });
  it('Return an array of users with followings', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .set('authorization', userToken)
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body.users).to.be.an('array');
        done();
      });
  });
});
