import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import helper from '../helpers/index';
import models from '../models';

chai.use(chaiHttp);
const { User } = models;
let unexistUser, userToken, userName, ownUserName, thirdUser;

const newUser = {
  username: 'followerTest', email: 'follower@email.com', password: helper.hashPassword('123Qa@5678')
};
const newUserFollowing = {
  username: 'followingTest', email: 'following@email.com', password: '123Qa@5678'
};
const thirdFollowing = {
  username: 'thirdUserTest', email: 'thirdusertest@email.com', password: '123Qa@5678'
};
const userLogin = { email: 'follower@email.com', password: '123Qa@5678' };

describe('Follow or unfollow user', () => {
  before(async () => {
    const user = await User.create(newUser, { logging: false });
    const userFollowing = await User.create(newUserFollowing, { logging: false });
    const otherUser = await User.create(thirdFollowing, { logging: false });

    userName = userFollowing.dataValues.username;
    unexistUser = 'someunkownuser';
    ownUserName = user.dataValues.username;
    thirdUser = otherUser.dataValues.username;
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
  describe('Following the user', () => {
    it('Should be logged in', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${userName}/follow`)
        .end((err, res) => {
          expect(res.body).to.have.status(401);
          done();
        });
    });
    it('You cannot follow user which is not exist', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${unexistUser}/follow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(404);
          expect(res.body.errors.body[0]).to.be.equal('User not found');
          done();
        });
    });
    it('You cannot follow yourself', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${ownUserName}/follow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(400);
          expect(res.body.errors.body[0]).to.be.equal('You cannot follow yourself');
          done();
        });
    });
    it('You can follow a user', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${userName}/follow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(201);
          expect(res.body).to.have.property('user');
          done();
        });
    });
    it('You cannot follow user which you have followed', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${userName}/follow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(409);
          expect(res.body.errors.body[0]).to.be.equal('You have already followed the user');
          done();
        });
    });
    it('User can get a list of all following', (done) => {
      chai.request(app)
        .get(`/api/v1/profiles/${ownUserName}/following`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(200);
          expect(res.body).to.have.property('followings');
          done();
        });
    });
    it('User cannot get a list of followers the user which does not exist', (done) => {
      chai.request(app)
        .get(`/api/v1/profiles/${unexistUser}/following`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(404);
          expect(res.body.errors.body[0]).to.be.equal('User not found');
          done();
        });
    });
    it('User cannot get a list followers of the profile', (done) => {
      chai.request(app)
        .get(`/api/v1/profiles/${thirdUser}/followers`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(401);
          expect(res.body.errors.body[0]).to.be.equal('You are not allowed to view other\'s profile');
          done();
        });
    });
    it('User can get a list of all followers', (done) => {
      chai.request(app)
        .get(`/api/v1/profiles/${ownUserName}/followers`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(200);
          expect(res.body).to.have.property('followers');
          done();
        });
    });
  });
  describe('Unfollowing the user', () => {
    it('Should be logged in', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${userName}/unfollow`)
        .end((err, res) => {
          expect(res.body).to.have.status(401);
          done();
        });
    });
    it('You cannot unfollow user which is not exist', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${unexistUser}/unfollow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(404);
          expect(res.body.errors.body[0]).to.be.equal('User not found');
          done();
        });
    });
    it('You cannot unfollow user which you have not followered', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${thirdUser}/unfollow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(404);
          expect(res.body.errors.body[0]).to.be.equal('User is not in your followers');
          done();
        });
    });
    it('You can unfollow a user', (done) => {
      chai.request(app)
        .post(`/api/v1/profiles/${userName}/unfollow`)
        .set('authorization', userToken)
        .end((err, res) => {
          expect(res.body).to.have.status(200);
          expect(res.body.message).to.be.equal('User removed in your following');
          done();
        });
    });
  });
});
