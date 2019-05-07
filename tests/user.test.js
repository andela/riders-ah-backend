import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

chai.use(chaiHttp);

const user = {
  username: 'test',
  email: 'andela@gmail.com',
  password: '123Qa@5678'
};

const incorrectnuser = {
  email: 'eric@gmail.com',
  password: '123Qa@5678'
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
  it('Email is required', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtotest',
        password: '123Qa@5678'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('Email is required');
        done();
      });
  });
  it('Username is required', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        email: 'testtotest@gmail.com',
        password: '123Qa@5678'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('Username is required');
        done();
      });
  });
  it('Password is required', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtotest',
        email: 'testtotest@gmail.com',
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('Password is required');
        done();
      });
  });
  it('Invalid E-mail', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        email: 'testtotestgmail.com',
        username: 'testtotest',
        password: '123Qa@5678'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('E-mail is invalid');
        done();
      });
  });
  it('Email already in use', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtest',
        email: 'andela@gmail.com',
        password: '123Qa@5678'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('email is already in use');
        done();
      });
  });
  it('Username already in use', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'test',
        email: 'test@gmail.com',
        password: '123Qa@5678'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('Username is already in use');
        done();
      });
  });
  it('Check if the password contains digit', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtoftest',
        email: 'test@gmail.com',
        password: 'aaa'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('The password Must contain at least one number');
        done();
      });
  });
  it('Check if the password contains lowercase character', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtoftest',
        email: 'test@gmail.com',
        password: '123'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('The password must contain a lower case character');
        done();
      });
  });
  it('Check if the password contains uppercase character', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtoftest',
        email: 'test@gmail.com',
        password: 'a123'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('the password should contain an uppercase character');
        done();
      });
  });
  it('Check if the password contains special character', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtoftest',
        email: 'test@gmail.com',
        password: 'a123U'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('the password should contain a special character');
        done();
      });
  });
  it('Check if the password does not contains less than 8 characters', (done) => {
    chai.request(server)
      .post('/api/v1/users/signup')
      .send({
        username: 'testtoftest',
        email: 'test@gmail.com',
        password: 'a123U@'
      })
      .end((err, res) => {
        expect(res.body).to.have.status(400);
        expect(res.body.errors.body[0]).to.be.equal('password must not be less than 8 characters');
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
