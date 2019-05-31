import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import model from '../models';
import helper from '../helpers';

chai.use(chaiHttp);


let tokenForUser, newGenSlug;
const { User } = model;

const userLogins = {
  email: 'report@andela.com',
  password: 'Password@1'
};
const articleToReport = {
  title: 'How Technology is Hijacking Your Mind',
  description: 'from a Magician and Google Design Ethicist',
  body: 'why I spent the last three years as a Design Ethicisted',
  image: 'https/piimg.com',
  tags: ['tag1', 'tag2']
};
describe('Test report articles', () => {
  before(async () => {
    await User.create({
      username: 'report',
      email: 'report@andela.com',
      roles: 'super_admin',
      password: helper.hashPassword('Password@1'),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  it('User must be authenticated', (done) => {
    chai
      .request(app)
      .post('/api/v1/users/login')
      .send(userLogins)
      .end((err, res) => {
        tokenForUser = res.body.token;
        res.body.should.have.property('token');
        done();
      });
  });
  it('Should have article to be reported', (done) => {
    chai
      .request(app)
      .post('/api/v1/articles')
      .set('authorization', tokenForUser)
      .send(articleToReport)
      .end((error, res) => {
        newGenSlug = res.body.article.slug;
        res.body.should.have.property('article');
        done();
      });
  });
  it('Should not accept  wrong parameters', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${newGenSlug}/report/XXXXXXXX`)
      .set('authorization', tokenForUser)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('Report type can only be plagiarism, spam, harassment or others');
        done();
      });
  });
  it('should able to report an article ', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${newGenSlug}/report/spam`)
      .set('authorization', tokenForUser)
      .send({
        reason: 'Misleading people while requesting for money'
      })
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should be able to report an article without a reason', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${newGenSlug}/report/plagiarism`)
      .set('authorization', tokenForUser)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        done();
      });
  });
  it('should  not be able to report articles not existing', (done) => {
    chai.request(app)
      .post('/api/v1/articles/no-slug/report/spam')
      .set('authorization', tokenForUser)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should not able to report twice', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${newGenSlug}/report/spam`)
      .set('authorization', tokenForUser)
      .send({
        reason: 'Misleading people while requesting for money'
      })
      .end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('status');
        res.body.should.have.property('error');
        done();
      });
  });
  it('should be able to get reported articles', (done) => {
    chai.request(app)
      .get('/api/v1/articles/reported')
      .set('authorization', tokenForUser)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status');
        res.should.be.an('object');
        res.body.data.reports.should.be.an('array');
        done();
      });
  });
});
