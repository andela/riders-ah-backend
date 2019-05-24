import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import helper from '../helpers/index';
import models from '../models';

chai.use(chaiHttp);
const { User, Article } = models;
let authorToken = null, readerToken = null, slug = null;
const newAuthorUser = {
  username: 'authorTest', email: 'authorstat@email.com', password: helper.hashPassword('123Qa@5678')
};
const newReaderUser = {
  username: 'readerTest', email: 'readerstat@email.com', password: helper.hashPassword('123Qa@5678')
};

const authorLogin = { email: 'authorstat@email.com', password: '123Qa@5678' };
const readerLogin = { email: 'readerstat@email.com', password: '123Qa@5678' };
describe('/api/v1/articles/reading/statistics. Article reading statistics', () => {
  before(async () => {
    const author = await User.create(newAuthorUser);
    await User.create(newReaderUser);

    const newArticle = {
      body: 'Some thing seems like body',
      title: 'My favorite quote',
      description: 'Quote about life',
      image: 'my-image.com',
      slug: 'my-favorite-quote-slug',
      authorId: author.dataValues.id
    };
    await Article.create(newArticle);
    slug = 'my-favorite-quote-slug';
  });
  it('Author login', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(authorLogin)
      .end((err, res) => {
        authorToken = res.body.token;
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('Reader login', (done) => {
    chai.request(app)
      .post('/api/v1/users/login')
      .send(readerLogin)
      .end((err, res) => {
        readerToken = res.body.token;
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('Read an article then save stats', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${slug}`)
      .set('authorization', readerToken)
      .end((err, res) => {
        expect(res.body.article).to.be.an('object');
        done();
      });
  });
  it('Read another article then save stats', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${slug}`)
      .set('authorization', readerToken)
      .end((err, res) => {
        expect(res.body.article).to.be.an('object');
        done();
      });
  });
  it('Should be get article reading stats', (done) => {
    chai.request(app)
      .get('/api/v1/articles/reading/statistics')
      .set('authorization', authorToken)
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body.articles).to.be.an('array');
        done();
      });
  });
  it('Should be get reading statistics', (done) => {
    chai.request(app)
      .get('/api/v1/users/reading/statistics')
      .set('authorization', readerToken)
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body.readStats).to.be.an('object');
        done();
      });
  });
});
