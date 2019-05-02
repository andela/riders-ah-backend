import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import model from '../models';
import helper from '../helpers';

const { expect } = chai;

chai.use(chaiHttp);
describe('GET /api/v1/users/:id', () => {
  let Token;
  before(async () => {
    const { User } = model;

    await User.create(
      {
        username: 'maningiri',
        email: 'something@gmail.com',
        bio: 'alhamdulillah',
        image: 'www.jgdh.com',
        password: helper.hashPassword('amandazi'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { logging: false }
    );
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
  it('should get a specific profile', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/1')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data)
          .to.have.property('username')
          .eql('maningiri');
        expect(res.body.data)
          .to.have.property('bio')
          .eql('alhamdulillah');
        expect(res.body.data)
          .to.have.property('image')
          .eql('www.jgdh.com');
        expect(res.body.data.password).to.be.equal(undefined);
        done();
      });
  });
  it('should get an error message', (done) => {
    chai
      .request(app)
      .get('/api/v1/users/2')
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body)
          .to.have.property('message')
          .to.be.a('string');
        done();
      });
  });

  it('should update bio of the profile', (done) => {
    chai
      .request(app)
      .put('/api/v1/users/1')
      .set('Authorization', Token)
      .send({ bio: 'alhamdulillah' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data)
          .to.have.property('bio')
          .eql('alhamdulillah');
        expect(res.body.data)
          .to.have.property('image')
          .eql('www.jgdh.com');
        expect(res.body.data.password).to.be.equal(undefined);
        done();
      });
  });
  it('should update image url ', (done) => {
    chai
      .request(app)
      .put('/api/v1/users/1')
      .set('Authorization', Token)
      .send({ image: 'www.jgdh.com' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data)
          .to.have.property('bio')
          .eql('alhamdulillah');
        expect(res.body.data)
          .to.have.property('image')
          .eql('www.jgdh.com');
        expect(res.body.data.password).to.be.equal(undefined);
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
