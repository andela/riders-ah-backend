/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import model from '../models';
import helper from '../helpers';

const { expect } = chai;
let newId;
let adminID;
chai.use(chaiHttp);

describe('role based access', () => {
  let Token, adminToken;
  before(async () => {
    const { User } = model;
    const admin = await User.create({
      username: 'maningiria',
      email: 'something2@gmail.com',
      bio: 'alhamdulillah',
      image: 'www.jgdh.com',
      password: helper.hashPassword('amandazi'),
      roles: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await User.create(
      {
        username: 'maningiri',
        email: 'something@gmail.com',
        bio: 'alhamdulillah',
        image: 'www.jgdh.com',
        password: helper.hashPassword('amandazi'),
        roles: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { logging: false }
    );
    const newUser = await User.create(
      {
        username: 'maningiriq',
        email: 'something1@gmail.com',
        bio: 'alhamdulillah',
        image: 'www.jgdh.com',
        password: helper.hashPassword('amandazi'),
        roles: 'super_admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { logging: false }
    );
    newId = newUser.get().id;
    adminID = admin.get().id;
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

  it('Role of the user has been updated', (done) => {
    chai
      .request(app)
      .put(`/api/v1/users/roles/${newId}`)
      .set('Authorization', Token)
      .send({
        email: 'something@gmail.com',
        password: 'amandazi'
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body)
          .to.have.property('message')
          .eql('role of the user updated successfuly');
        done();
      });
  });
  it("user doesn't exist", (done) => {
    chai
      .request(app)
      .put('/api/v1/users/roles/10000')
      .set('Authorization', Token)
      .send({
        roles: 'admin'
      })
      .end((err, res) => {
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('the user should be logged in', (done) => {
    chai
      .request(app)
      .post('/api/v1/users/login')
      .send({
        email: 'something2@gmail.com',
        password: 'amandazi'
      })
      .end((err, res) => {
        adminToken = res.body.token;
        expect(res.body).to.have.property('token');
        done();
      });
  });
  it('super admin should be able to change access level', (done) => {
    chai
      .request(app)
      .put(`/api/v1/users/roles/${adminID}`)
      .set('Authorization', adminToken)
      .send({
        roles: 'admin'
      })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.property('message');
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
