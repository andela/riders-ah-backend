import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import model from '../models';

chai.should();
chai.use(chaiHttp);

const { Article, User } = model;
const user = {
  username: 'bubble',
  email: 'bubble@andela.com',
  password: 'Fiston@123'
};

describe('test the creation of a like and replacement of like by dislike', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('user should be able to like an article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/like')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('reaction');
        res.body.reaction.should.have.property('id');
        res.body.reaction.should.have.property('userId');
        res.body.reaction.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.reaction.should.have.property('status').eql('like');
        res.body.reaction.should.have.property('updatedAt');
        res.body.reaction.should.have.property('createdAt');
        done();
      });
  });
  it('user should be able to replace a like by a dislike', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/dislike')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('like is replaced by dislike');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test the creation of a dislike and replacement of dislike by like', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('user should be able to dislike an article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/dislike')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('reaction');
        res.body.reaction.should.have.property('id');
        res.body.reaction.should.have.property('userId');
        res.body.reaction.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.reaction.should.have.property('status').eql('dislike');
        res.body.reaction.should.have.property('updatedAt');
        res.body.reaction.should.have.property('createdAt');
        done();
      });
  });
  it('user should be able to replace a dislike by a like', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/like')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('dislike is replaced by like');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test the creation of a dislike or a like on an existing article', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('user should only be able to like or dislike an existing article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-po/reaction/like')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('article with slug this-is-a-po do not exist');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test the deletion of a dislike or a like on an article if the user repeats a like or dislike', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/like')
      .set('authorization', Token)
      .end(() => {
        done();
      });
  });
  it('user should only be able to remove like or dislike on an article by reapeting a like or dislike', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/reaction/like')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your reaction is now neutral');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test the fetching of likes on an article', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('user should only be able to see likes on an article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/this-is-a-post/likes')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('likes');
        res.body.should.have.property('count');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test the fetching of dislikes on an article', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('user should only be able to see dislikes on an article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/this-is-a-post/dislikes')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('dislikes');
        res.body.should.have.property('count');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
