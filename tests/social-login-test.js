import chai from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import TestStrategy from '../helpers/TestStrategy';
import app from '../app';


chai.use(chaiHttp);

const { expect } = chai;


describe('Stategy name should be set', () => {
  it('should fail when strategy name is not set', (done) => {
    expect(() => passport.use(new TestStrategy(undefined, () => { }))).to.throw('No strategy Name');
    done();
  });
});

// GOOGLE TEST
describe('Sign up a user', () => {
  it('should create and authenticate a new user using google', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/google/callback')
      .send({ token: 'Bo1uEVfYBaRI' })
      .end((err, res) => {
        expect(res.body).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Should sign in user using google', () => {
  it('should sign in and authorize an existing user with a google account', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/google/callback')
      .send({ token: 'Bo1uEVfYBaRI' })
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

// FACEBOOK TEST
describe('Sign up a user', () => {
  it('should create and authenticate a new user using facebook', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/facebook/callback')
      .send({ token: 'EAALgGTpyC' })
      .end((err, res) => {
        expect(res.body).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Should sign in user using facebook', () => {
  it('should sign in and authorize an existing user with a google account', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/facebook/callback')
      .send({ token: 'EAALgGTpyC' })
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

// TWITTER TEST
describe('Sign up a user', () => {
  it('should create and authenticate a new user using twitter', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/twitter/callback')
      .send({ token: '6344594-UR' })
      .end((err, res) => {
        expect(res.body).to.have.status(201);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});

describe('Should sign in user', () => {
  it('should sign in and authorize an existing user with a google account using twitter', (done) => {
    chai
      .request(app)
      .get('/api/v1/login/twitter/callback')
      .send({ token: '6344594-UR' })
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body).to.be.an('object');
        done();
      });
  });
});
