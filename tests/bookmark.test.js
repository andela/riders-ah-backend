import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import model from '../models';

const { Article, User } = model;

chai.should();
chai.use(chaiHttp);

describe('test creating a bookmark on an article', () => {
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
  it('test the creation of a bookmark', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/bookmark')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('Bookmark');
        res.body.Bookmark.should.have.property('userId');
        res.body.Bookmark.should.have.property('titleSlug');
        res.body.Bookmark.should.have.property('createdAt');
        res.body.Bookmark.should.have.property('updatedAt');
        res.body.Bookmark.should.have.property('id');
        done();
      });
  });
  it('test fetching bookmarks made by logged in user', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/bookmarks')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('Bookmarks');
        res.body.Bookmarks[0].should.have.property('id');
        res.body.Bookmarks[0].should.have.property('userId');
        res.body.Bookmarks[0].should.have.property('createdAt');
        res.body.Bookmarks[0].should.have.property('article');
        res.body.Bookmarks[0].article.should.have.property('title');
        res.body.Bookmarks[0].article.should.have.property('description');
        res.body.Bookmarks[0].article.should.have.property('slug');
        done();
      });
  });
  it('test the removal of a bookmark when bookmarked again', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a-post/bookmark')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('your bookmark is for article with slug this-is-a-post is removed, bookmark again');
        done();
      });
  });
  it('test fetching bookmarks that are already created', (done) => {
    chai.request(app)
      .get('/api/v1/articles/user/bookmarks')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('Bookmarks').eql('no bookmarks made');
        done();
      });
  });
  it('test the creation of a bookmark on an existing article', (done) => {
    chai.request(app)
      .post('/api/v1/articles/this-is-a/bookmark')
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
