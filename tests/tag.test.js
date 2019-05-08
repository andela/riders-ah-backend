import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import app from '../app';
import models from '../models';
import helper from '../helpers';

const { User, Article } = models;

chai.use(chaiHttp);

let userToken, newTag, newOtherTag, articleSlug, articleSlug2;
const newUser = {
  username: 'userTest', email: 'usertest@emai.com', password: helper.hashPassword('user@password')
};
const newUser2 = {
  username: 'userTest2', email: 'usertest1@emai.com', password: helper.hashPassword('user@password')
};

const userLogin = {
  email: 'usertest@emai.com', password: 'user@password'
};
const userLogin2 = {
  email: 'usertest1@emai.com', password: 'user@password'
};

describe('POST /api/v1/articles/tag, Tag article', () => {
  before(async () => {
    const user = await User.create(newUser, { logging: false });
    const user2 = await User.create(newUser2, { logging: false });
    const testArticle = await Article.create({
      title: 'Test title',
      body: 'Test body',
      description: 'Test description',
      image: 'image.test',
      slug: 'test-slug',
      authorId: user.dataValues.id
    }, { logging: false });
    const testArticle2 = await Article.create({
      title: 'Test title',
      body: 'Test body',
      description: 'Test description',
      image: 'image.test',
      slug: 'test-slug-r',
      authorId: user2.dataValues.id
    }, { logging: false });
    newTag = { name: 'javascript' };
    newOtherTag = { articleId: testArticle2.dataValues.id, name: 'json' };
    articleSlug = testArticle.dataValues.slug;
    articleSlug2 = testArticle2.dataValues.slug;
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
  it('Login second user', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(userLogin2)
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('User can tag their article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/tag`)
      .set('authorization', userToken)
      .send(newTag)
      .end((err, res) => {
        expect(res.body.status).to.be.equal(201);
        expect(res.body).to.have.property('tag');
        expect(res.body.tag).to.have.property('name');
        expect(res.body.tag).to.have.property('articleId');
        done();
      });
  });
  it('User can only tag their article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug2}/tag`)
      .set('authorization', userToken)
      .send(newOtherTag)
      .end((err, res) => {
        expect(res.body).to.have.status(401);
        expect(res.body.error).to.be.equal('You don\'t have access');
        done();
      });
  });
  it('User cannot tag article which is not found', (done) => {
    chai.request(app)
      .post('/api/v1/articles/something-not-found/tag')
      .set('authorization', userToken)
      .send(newTag)
      .end((err, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body.error).to.be.equal('Article Not found');
        done();
      });
  });
  it('User cannot tag if he is not logged in', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/tag`)
      .send(newTag)
      .end((err, res) => {
        expect(res.body).to.have.status(401);
        done();
      });
  });
  it('User cannot tag article with no tag name', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/tag`)
      .set('authorization', userToken)
      .send({})
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('Provide tag name');
        done();
      });
  });
  it('User cannot add tag that has already added', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/tag`)
      .set('authorization', userToken)
      .send(newTag)
      .end((err, res) => {
        expect(res.body).to.have.status(409);
        expect(res.body.errors.body[0]).to.be.equal('The tag was already added');
        done();
      });
  });
  it('Return an array of tags', (done) => {
    chai.request(app)
      .get('/api/v1/articles/tag/list')
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body.tags).to.be.an('array');
        done();
      });
  });
});
