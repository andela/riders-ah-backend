import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../app';
import helper from '../helpers';
import model from '../models';
import emitter from '../helpers/eventEmitters';

chai.use(chaiHttp);
const { expect } = chai;

const article = {
  title: 'How Technology is Hijacking Your Mind',
  description: 'from a Magician and Google Design Ethicist',
  body: 'why I spent the last three years as a Design Ethicisted',
  image: 'https/piimg.com'
};
const commentOnArticle = {
  body: 'New comment on the article'
};
let articleSlug = null;
let TokenToTestNotification = null;
let userId, followingId;
describe('Notifications Test', () => {
  before(async () => {
    const { User, Notification, Follows } = model;
    const follower = await User.create({
      username: 'Notification',
      email: 'follower@andela.com',
      bio: 'A good writter',
      image: 'https://pic399',
      password: helper.hashPassword('password@123K'),
      createdAt: new Date(),
      updatedAt: new Date()
    },);
    followingId = follower.dataValues.id;
    const Testuser = await User.create({
      username: 'NotificationUser',
      email: 'notification@andela.com',
      bio: 'A good writter',
      image: 'https://pic399',
      password: helper.hashPassword('password@123K'),
      createdAt: new Date(),
      updatedAt: new Date()
    },);
    userId = Testuser.dataValues.id;
    await Follows.create({
      follower: userId,
      following: followingId,
      createdAt: new Date(),
      updatedAt: new Date()
    },);
    await Notification.create({
      userId,
      notificationMessage: 'New article called How Technology is Hijacking Your Mind was created by Samuel ',
      createdAt: new Date(),
      updatedAt: new Date()
    },);
  });
  describe('To choose preferance, User must be logged in', () => {
    it('User must be logged in', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'notification@andela.com',
          password: 'password@123K'
        })
        .end((err, res) => {
          TokenToTestNotification = res.body.token;
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });
  });
  describe('User should be able to unset and set notifications preference', () => {
    it('User should be able to unset email option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/unSet/receiveEmail')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification successfully unsetted.');
          done();
        });
    });
    it('User should be able to set email option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/set/receiveEmail')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification option setted.');
          done();
        });
    });
    it('User should be able to unset in app option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/unSet/receiveInApp')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification successfully unsetted.');
          done();
        });
    });
    it('User should be able to set in app option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/set/receiveInApp')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification option setted.');
          done();
        });
    });
    it('User should be able to unset follower option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/unSet/onfollowPublish')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification successfully unsetted.');
          done();
        });
    });
    it('User should be able to set follower option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/set/onfollowPublish')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification option setted.');
          done();
        });
    });
    it('User should be able to unset notification for article favorited option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/unSet/onArticleFavoritedInteraction')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification successfully unsetted.');
          done();
        });
    });
    it('User should be able to set notification for article favorited option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/set/onArticleFavoritedInteraction')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('Message').to.be.a('string');
          expect(res.body.Message).equals('Notification option setted.');
          done();
        });
    });
  });
  describe('User should not be able to choose wrong option', () => {
    it('User should get a message when setting a wrong option', (done) => {
      chai.request(app)
        .put('/api/v1/users/notification/set/xxxxx123')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.property('Error').to.be.a('string');
          expect(res.body.Error).equals('Only option must be receiveEmail, receiveInApp, onfollowPublish or onArticleFavoritedInteraction');
          done();
        });
    });
  });
  describe('User should to get notification', () => {
    it('User should be able to get notifications', (done) => {
      chai.request(app)
        .get('/api/v1/users/notifications/')
        .set('authorization', TokenToTestNotification)
        .end((err, res) => {
          expect(res.body).to.have.property('notification').to.be.an('array');
          done();
        });
    });
  });
  describe('Notification when article created', () => {
    const notificationEmitter = sinon.spy();
    emitter.on('onFollowPublish', notificationEmitter);
    it('Should emit event on article publish', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('authorization', TokenToTestNotification)
        .send(article)
        .end((err, res) => {
          articleSlug = res.body.article.slug;
          // check if event is called
          expect(notificationEmitter.called).to.equal(true);
          done();
        });
    });
  });
  describe('Notification when a comment is created', () => {
    const notificationEmitter = sinon.spy();
    emitter.on('onArticleInteraction', notificationEmitter);
    it('Should emit event', (done) => {
      chai.request(app)
        .post(`api/v1/article/${articleSlug}/comments`)
        .set('authorization', TokenToTestNotification)
        .send(commentOnArticle)
        .end(() => {
          // check if event is called
          expect(notificationEmitter.called).to.equal(true);
          done();
        });
    });
  });
});
