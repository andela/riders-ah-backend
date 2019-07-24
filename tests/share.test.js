import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import model from '../models';

const { Article, User } = model;

chai.should();
chai.use(chaiHttp);

describe('test sharing an article on social media and gmail', () => {
  let Token;
  let Slug;
  before((done) => {
    const user = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Fiston@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const article = {
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      category: 'Music',
      image: 'http://image.com',
    };
    chai.request(app)
      .post('/api/v1/articles')
      .set('authorization', Token)
      .send(article)
      .end((err, res) => {
        Slug = res.body.article.slug;
        done();
      });
  });
  it('test sharing on facebook', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/facebook`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('share');
        res.body.share.should.have.property('id');
        res.body.share.should.have.property('userId');
        res.body.share.should.have.property('titleSlug');
        res.body.share.should.have.property('platform');
        res.body.share.platform[0].should.be.eql('facebook');
        res.body.share.should.have.property('createdAt');
        res.body.share.should.have.property('updatedAt');
        done();
      });
  });
  it('test sharing on facebook again', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/facebook`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your facebook share is removed, you can share again');
        done();
      });
  });
  it('test sharing on twitter', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/twitter`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('share');
        res.body.share.should.have.property('id');
        res.body.share.should.have.property('userId');
        res.body.share.should.have.property('titleSlug');
        res.body.share.should.have.property('platform');
        res.body.share.platform[0].should.be.eql('twitter');
        res.body.share.should.have.property('createdAt');
        res.body.share.should.have.property('updatedAt');
        done();
      });
  });
  it('test sharing on twitter again', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/twitter`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your twitter share is removed, you can share again');
        done();
      });
  });
  it('test sharing on gmail', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/gmail`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('share');
        res.body.share.should.have.property('id');
        res.body.share.should.have.property('userId');
        res.body.share.should.have.property('titleSlug');
        res.body.share.should.have.property('platform');
        res.body.share.platform[0].should.be.eql('gmail');
        res.body.share.should.have.property('createdAt');
        res.body.share.should.have.property('updatedAt');
        done();
      });
  });
  it('test sharing on gmail again', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/gmail`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your gmail share is removed, you can share again');
        done();
      });
  });
  it('test sharing on linkedin', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/linkedin`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('share');
        res.body.share.should.have.property('id');
        res.body.share.should.have.property('userId');
        res.body.share.should.have.property('titleSlug');
        res.body.share.should.have.property('platform');
        res.body.share.platform[0].should.be.eql('linkedin');
        res.body.share.should.have.property('createdAt');
        res.body.share.should.have.property('updatedAt');
        done();
      });
  });
  it('test sharing on linkedin again', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/linkedin`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your linkedin share is removed, you can share again');
        done();
      });
  });
  it('test sharing on a valid platform', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${Slug}/share/linked`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('body');
        res.body.errors.body[0].should.be.eql('invalid platform in path');
        done();
      });
  });
  it('test sharing an article which exist', (done) => {
    chai.request(app)
      .post('/api/v1/articles/fakeslug/share/facebook')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('body');
        res.body.errors.body[0].should.be.eql('article not found');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: Slug }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});

describe('test getting shares on a given article', () => {
  let Token;
  before((done) => {
    const user = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Fiston@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  beforeEach((done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/share/facebook')
      .set('authorization', Token)
      .end(() => {
        done();
      });
  });
  it('test getting shares on an article', (done) => {
    chai.request(app)
      .get('/api/v1/articles/this-is-a-post/shares')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.should.have.property('Shares');
        res.body.should.have.property('facebookShares');
        res.body.should.have.property('twitterShares');
        res.body.should.have.property('linkedinShares');
        res.body.should.have.property('gmailShares');
        done();
      });
  });
  it('test getting shares on an article which exist', (done) => {
    chai.request(app)
      .get('/api/v1/articles/fakeslug/shares')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('body');
        res.body.errors.body[0].should.be.eql('article not found');
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

describe('test if article is already shared', () => {
  let notSharedSlug;
  let Token;
  before((done) => {
    const user = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Fiston@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const article = {
      title: 'this post is not shared',
      body: 'this post is going to be used in testing for sharing',
      description: 'a despripton not shared',
      category: 'shared',
      image: 'http://image.com/notShared',
    };
    chai.request(app)
      .post('/api/v1/articles')
      .set('authorization', Token)
      .send(article)
      .end((err, res) => {
        notSharedSlug = res.body.article.slug;
        done();
      });
  });
  it('test getting shares of an already shared article', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${notSharedSlug}/shares`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('this article has not been shared yet');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: notSharedSlug }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
