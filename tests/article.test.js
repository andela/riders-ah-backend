import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);
const { expect } = chai;

const user = {
  username: 'Test User',
  email: 'kigali@andela.com',
  password: 'password'
};
const otherUser = {
  username: 'New User',
  email: 'kgl@andela.com',
  password: 'password'
};

const article = {
  title: 'How Technology is Hijacking Your Mind',
  description: 'from a Magician and Google Design Ethicist',
  body: 'why I spent the last three years as a Design Ethicisted',
  image: 'https/piimg.com'
};
const invalidArticle = {
  description: 'from a Magician and Google Design Ethicist',
  body: 'why I spent the last three years as a Design Ethicisted'
};
const newArticle = {
  title: '  MY HijacMind',
  description: 'from a Magician and Google Design Ethicist',
  body: 'why I spent the last three years as a Design Ethicisted',
  image: 'https/piimg.com'
};

const wrongArticle = {
  title: 'How Technology is Hijacking Your Mind',
  description: 'from a Magician and Google Design Ethicist',
  body: '',
  images: 'https/piimg.com'
};

const updateArticle = {
  title: 'Butare',
  body: 'A of work https://picsum:2000 Description ',
  description: ' work PUT'
};
let userToken = null;
let generatedSlug = null;

describe('Test article', () => {
  describe('To create article user must be registered and authenticated', () => {
    it('User should have account', (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .send(user)
        .end((err, res) => {
          expect(res.body).to.have.status(201);
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });
    it('User must be logged in', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send(user)
        .end((err, res) => {
          userToken = res.body.token;
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });
  });
  describe('Authenticated user must be able to create article', () => {
    it('Should create a new article', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('authorization', userToken)
        .send(article)
        .end((error, res) => {
          generatedSlug = res.body.article.slug;
          expect(res.body).to.have.property('article');
          expect(res.body.article).to.have.property('author');
          expect(res.body.article).to.have.property('title');
          expect(res.body.article).to.have.property('body');
          expect(res.body.article).to.have.property('description');
          expect(res.body.article.title).equals('How Technology is Hijacking Your Mind');
          expect(res.body.article.description).equals('from a Magician and Google Design Ethicist');
          expect(res.body.article.body).equals('why I spent the last three years as a Design Ethicisted');
          expect(res.body.article.image).equals('https/piimg.com');
          done();
        });
    });
    it('Should return error when data are wrong ', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('authorization', userToken)
        .send(wrongArticle)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(422);
          done();
        });
    });
  });
  describe('It should not allow only owner to update and delete article', () => {
    let accessToken = null;
    it('User should have account', (done) => {
      chai.request(app)
        .post('/api/v1/users/signup')
        .send(otherUser)
        .end((err, res) => {
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });
    it('User must be logged in', (done) => {
      chai.request(app)
        .post('/api/v1/users/login')
        .send(otherUser)
        .end((err, res) => {
          accessToken = res.body.token;
          expect(res.body).to.have.status(200);
          expect(res.body).to.have.property('token').to.be.a('string');
          done();
        });
    });
    it('Should get an article by slug', (done) => {
      chai.request(app)
        .get(`/api/v1/articles/${generatedSlug}`)
        .end((error, res) => {
          expect(res.body).to.have.property('article');
          expect(res.body.article.slug).equals(generatedSlug);
          expect(res.body.article.title).equals('How Technology is Hijacking Your Mind');
          expect(res.body.article.description).equals('from a Magician and Google Design Ethicist');
          done();
        });
    });
    it('Should give an error message when article not found', (done) => {
      chai.request(app)
        .get('/api/v1/articles/unexestingSlug')
        .end((error, res) => {
          expect(res.body).to.have.status(404);
          expect(res.body.error).equals('Article Not found');
          done();
        });
    });
    it('Should get all articles', (done) => {
      chai.request(app)
        .get('/api/v1/articles/')
        .end((error, res) => {
          expect(res.body).to.have.property('articles');
          done();
        });
    });
    it('Should have access to delete', (done) => {
      chai.request(app)
        .delete(`/api/v1/articles/${generatedSlug}`)
        .set('authorization', accessToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).equals('You don\'t have access');
          done();
        });
    });
    it('Should  have access to update', (done) => {
      chai.request(app)
        .put(`/api/v1/articles/${generatedSlug}`)
        .set('authorization', accessToken)
        .send(newArticle)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(401);
          expect(res.body.error).equals('You don\'t have access');
          done();
        });
    });
  });

  describe('Owner must be able to update and delete article', () => {
    let newslug = null;
    it('Should update ', (done) => {
      chai.request(app)
        .put(`/api/v1/articles/${generatedSlug}`)
        .set('authorization', userToken)
        .send(updateArticle)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body.Message).equals('Article updated successfully.');
          done();
        });
    });
    it('Should create a new article', (done) => {
      chai.request(app)
        .post('/api/v1/articles')
        .set('authorization', userToken)
        .send(newArticle)
        .end((error, res) => {
          newslug = res.body.article.slug;
          done();
        });
    });
    it('Should delete article', (done) => {
      chai.request(app)
        .delete(`/api/v1/articles/${newslug}`)
        .set('authorization', userToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body.message).equals('Article deleted');
          done();
        });
    });
    it('Should provide message while deleting unexisting article', (done) => {
      chai.request(app)
        .delete('/api/v1/articles/unexistingSlug')
        .set('authorization', userToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).equals('Article Not found');
          done();
        });
    });
    it('Should provide message while updating unexisting article', (done) => {
      chai.request(app)
        .put('/api/v1/articles/unexistingSlug')
        .set('authorization', userToken)
        .send(newArticle)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body.error).equals('Article Not found');
          done();
        });
    });
    it('Validate Article', (done) => {
      chai.request(app)
        .post('/api/v1/articles/')
        .set('authorization', userToken)
        .send(invalidArticle)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(422);
          expect(res.body).to.have.property('Error');
          done();
        });
    });
  });
});
