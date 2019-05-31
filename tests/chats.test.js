import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import model from '../models';
import helper from '../helpers';

const { expect } = chai;
chai.use(chaiHttp);

describe('basic chat', () => {
  let Token;
  before(async () => {
    const { User } = model;
    await User.create({
      username: 'maningiri',
      email: 'something@gmail.com',
      bio: 'alhamdulillah',
      image: 'www.jgdh.com',
      password: helper.hashPassword('amandazi'),
      roles: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  });
  it('the user should be logged in', (done) => {
    chai
      .request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'something@gmail.com',
        password: 'amandazi'
      })
      .end((err, res) => {
        Token = res.body.token;
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('Chat messages should be shown to all online users', (done) => {
    chai
      .request(app)
      .get('/api/v1/messages')
      .set('Authorization', Token)
      .send({
        message: 'something'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.include.keys('messages');
        done();
      });
  });
  after(async () => {
    const { User } = model;

    await User.destroy({
      where: { email: 'something@gmail.com' }
    });
  });
});
