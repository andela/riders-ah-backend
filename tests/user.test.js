import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);

const user = {
  username: 'test',
  email: 'andela@gmail.com',
  password: '12345678'
};

const incorrectnuser = {
  email: 'eric@gmail.com',
  password: '12345678'
};

const incorrectpassword = {
  email: 'andela@gmail.com',
  password: 'abcbdbdb'
};

describe('Users Authentication', () => {
  it('User Signup', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.status(201);
        expect(res.body.user).to.have.property('username').to.be.equal(user.username);
        expect(res.body.user).to.have.property('email').to.be.equal(user.email);
        expect(res.body.user.password).to.be.equal(undefined);
        expect(res.body.user.email).to.not.be.equal('');
        expect(res.body.user.password).to.not.be.equal('');
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('user already exist', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.status(409);
        done();
      });
  });
  it('user login', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(user)
      .end((err, res) => {
        expect(res.body).to.have.status(200);
        expect(res.body.message).to.be.equal('User logged in successfully');
        expect(res.body).to.have.property('token').to.be.a('string');
        done();
      });
  });
  it('Incorrect email', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(incorrectnuser)
      .end((err, res) => {
        expect(res.body).to.have.status(401);
        expect(res.body.err.message).to.be.equal('Incorrect Credentials.');
        done();
      });
  });
  it('Incorrect password', (done) => {
    chai.request(server)
      .post('/api/v1/users/login')
      .send(incorrectpassword)
      .end((err, res) => {
        expect(res.body).to.have.status(401);
        expect(res.body.err.message).to.be.equal('Incorrect credentials.');
        done();
      });
  });
});
