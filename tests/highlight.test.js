import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.should();
chai.use(chaiHttp);

const userTest = {
  username: 'highlighttester',
  email: 'highlighttester@test.com',
  password: 'testRate@123!'
};

const articleTest = {
  title: 'This is the title of the article',
  description: 'This is the description of the acrticle',
  category: 'Technology',
  body: 'this is the body of the article',
  image: 'https/piimg.com/img.jpg'
};

const highlightTest = {
  startindex: 0,
  endindex: 15,
  highlightedtext: 'this is the body'
};

const commentOnHighlight = {
  comment: 'this is a text'
};

let toKen = null;
let articleSlug = null;
let highlightedText = null;
describe('Hightlight and comment a text in an article', () => {
  it('User Signup', (done) => {
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(userTest)
      .end((err, res) => {
        toKen = res.body.token;
        expect(res.body).to.have.status(201);
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('User create an article', (done) => {
    chai.request(app)
      .post('/api/v1/articles')
      .set('authorization', toKen)
      .send(articleTest)
      .end((error, res) => {
        articleSlug = res.body.article.slug;
        expect(res.body).to.have.property('article');
        expect(res.body.article).to.have.property('author');
        expect(res.body.article).to.have.property('title');
        expect(res.body.article).to.have.property('body');
        expect(res.body.article).to.have.property('description');
        expect(res.body.article.title).equals('This is the title of the article');
        expect(res.body.article.description).equals('This is the description of the acrticle');
        expect(res.body.article.body).equals('this is the body of the article');
        expect(res.body.article.image).equals('https/piimg.com/img.jpg');
        done();
      });
  });
  it('User highlight a text on an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send(highlightTest)
      .end((error, res) => {
        highlightedText = res.body.data.highlights.id;
        expect(res.body).to.have.status(201);
        expect(res.body.data).to.have.property('highlights');
        expect(res.body.data).to.have.property('comment');
        expect(res.body.data).to.have.property('author');
        expect(res.body.data.highlights).to.have.property('id');
        expect(res.body.data.highlights.articleSlug).equals(articleSlug);
        expect(res.body.data.highlights.startIndex).equals(0);
        expect(res.body.data.highlights.endIndex).equals(15);
        expect(res.body.data.highlights.highlightedText).equals('this is the body');
        done();
      });
  });
  it('Highlighted Text length mismatch with the number of indexes', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send({
        startindex: 0,
        endindex: 11,
        highlightedtext: 'this is the body'
      })
      .end((error, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('Highlighted Text Length does not match with the start and end index');
        done();
      });
  });
  it('User get text highlighted on an article', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('articleSlug');
        expect(res.body.data[0]).to.have.property('highlightedText');
        expect(res.body.data[0]).to.have.property('createdAt');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body.data[0]).to.have.property('author');
        done();
      });
  });
  it('User comment on a highlighted text of an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight/${highlightedText}/comment`)
      .set('authorization', toKen)
      .send(commentOnHighlight)
      .end((error, res) => {
        expect(res.body).to.have.status(201);
        expect(res.body.data).to.have.property('comment');
        expect(res.body.data).to.have.property('author');
        expect(res.body.data.comment).to.have.property('id');
        expect(res.body.data.comment.highlightId).equals(highlightedText);
        expect(res.body.data.comment.comment).equals('this is a text');
        done();
      });
  });

  it('Get all comments of highlighted text related to an article', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${articleSlug}/highlights/comments`)
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('articleSlug').to.be.equal(articleSlug);
        expect(res.body.data[0]).to.have.property('startIndex').to.be.equal(0);
        expect(res.body.data[0]).to.have.property('endIndex').to.be.equal(15);
        expect(res.body.data[0]).to.have.property('highlightedText').to.be.equal('this is the body');
        expect(res.body.data[0]).to.have.property('createdAt');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body.data[0]).to.have.property('author');
        expect(res.body.data[0]).to.have.property('comments');
        done();
      });
  });
  it('Article does not exit', (done) => {
    chai.request(app)
      .get('/api/v1/articles/test-to-test-to-test/highlights/comments')
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equal('The Article does not exist');
        done();
      });
  });
  it('Article does not exist', (done) => {
    chai.request(app)
      .get('/api/v1/articles/uuuu-tt/highlight')
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('This article does not exist');
        done();
      });
  });
  it('Highlighted text does not exist', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${articleSlug}/highlight/100/comment`)
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('The Highlighted text does not exist');
        done();
      });
  });
  it('User get comments on highlighted text', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${articleSlug}/highlight/${highlightedText}/comment`)
      .set('authorization', toKen)
      .end((error, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('comment');
        expect(res.body.data[0]).to.have.property('createdAt');
        expect(res.body.data[0]).to.have.property('updatedAt');
        expect(res.body.data[0]).to.have.property('author');
        expect(res.body.data[0]).to.have.property('highlight');
        expect(res.body.data[0].highlight).to.have.property('articleSlug');
        expect(res.body.data[0].highlight).to.have.property('highlightedText');
        done();
      });
  });
  it('User cannot highlight 2 times a text', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send(highlightTest)
      .end((error, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('You have already highlighted this text');
        done();
      });
  });
  it('User cannot highlight unexisting text on an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send({
        startindex: 0,
        endindex: 6,
        highlightedtext: 'txtxtx',
      })
      .end((error, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('The text highlighted is not in the article');
        done();
      });
  });
  it('User highlight and comment a text on an article', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send({
        startindex: 0,
        endindex: 6,
        highlightedtext: 'body of',
        comment: 'I not well spelled'
      })
      .end((error, res) => {
        highlightedText = res.body.data.highlights.id;
        expect(res.body).to.have.status(201);
        expect(res.body.data).to.have.property('highlights');
        expect(res.body.data).to.have.property('comment');
        expect(res.body.data).to.have.property('author');
        expect(res.body.data.highlights).to.have.property('id');
        expect(res.body.data.highlights.articleSlug).equals(articleSlug);
        expect(res.body.data.highlights.startIndex).equals(0);
        expect(res.body.data.highlights.endIndex).equals(6);
        expect(res.body.data.highlights.highlightedText).equals('body of');
        expect(res.body.data.comment).equals('I not well spelled');
        done();
      });
  });
  it('Highlighted text does not exist', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight/100/comment`)
      .set('authorization', toKen)
      .send(commentOnHighlight)
      .end((error, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('The Highlighted text does not exist');
        done();
      });
  });
  it('Comment required on commneting a highlight', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight/${highlightedText}/comment`)
      .set('authorization', toKen)
      .send()
      .end((error, res) => {
        expect(res.body).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('comment is required');
        done();
      });
  });
  it('Article not found on posting a highlight', (done) => {
    chai.request(app)
      .post('/api/v1/articles/test-test-to-test/highlight')
      .set('authorization', toKen)
      .send()
      .end((error, res) => {
        expect(res.body).to.have.status(404);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('article not found');
        done();
      });
  });
  it('Validation fields on highlight', (done) => {
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/highlight`)
      .set('authorization', toKen)
      .send()
      .end((error, res) => {
        expect(res.body).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors.body[0]).to.be.equals('startindex is required');
        expect(res.body.errors.body[1]).to.be.equals('endindex is required');
        expect(res.body.errors.body[2]).to.be.equals('highlightedtext is required');
        done();
      });
  });
});
