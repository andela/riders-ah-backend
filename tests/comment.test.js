import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import model from '../models';

chai.should();
chai.use(chaiHttp);

const { Article, User, Comment } = model;

describe('create, read, update and delete comment tests', () => {
  let Token;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const user = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Fiston@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('should comment on only existing article', (done) => {
    const data = {
      body: 'testing comment'
    };
    chai.request(app)
      .post('/api/v1/article/this-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('there is no article with the slug specified in the URL');
        done();
      });
  });
  it('should comment on only when the is something in body', (done) => {
    const data = {
      body: ' '
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('INVALID comment body');
        done();
      });
  });
  it('should create a threaded comment', (done) => {
    const data = {
      body: 'testing comment'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
    await Comment.destroy({
      where: { titleSlug: 'this-is-a-post' }
    });
  });
});
describe('test creation of first comment', () => {
  let Token;
  let commentId;
  let replyId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Fiston@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  it('should create the comment to be replied', (done) => {
    const data = {
      body: 'testing comment'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should create a reply to the first comment', (done) => {
    const data = {
      body: 'reply to the testing comment'
    };
    chai.request(app)
      .post(`/api/v1/article/comments/${commentId}/reply`)
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        replyId = res.body.id;
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('userId');
        res.body.should.have.property('replyid');
        res.body.should.have.property('titleSlug');
        res.body.should.have.property('body').eql('reply to the testing comment');
        res.body.should.have.property('createdAt');
        res.body.should.have.property('updatedAt');
        done();
      });
  });
  it('should fetch all replies to the first comment', (done) => {
    chai.request(app)
      .get(`/api/v1/article/comments/${commentId}/replies`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        res.body.should.have.property('replies');
        done();
      });
  });
  const newReply = {
    body: 'reply to update'
  };
  it('user updates one reply with a new reply', (done) => {
    chai.request(app)
      .put(`/api/v1/article/comments/${commentId}/replies/${replyId}`)
      .set('authorization', Token)
      .send(newReply)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('response');
        res.body.response.should.have.property('id').eql(replyId);
        res.body.response.should.have.property('replyid');
        res.body.response.should.have.property('userId');
        res.body.response.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.response.should.have.property('body').eql('reply to update');
        res.body.response.should.have.property('createdAt');
        res.body.response.should.have.property('updatedAt');
        done();
      });
  });
  it('user deletes one reply', (done) => {
    chai.request(app)
      .delete(`/api/v1/article/comments/${commentId}/replies/${replyId}`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`reply with id ${replyId} have been deleted`);
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
    await Comment.destroy({
      where: { titleSlug: 'this-is-a-post' }
    });
  });
});
describe('test the get all comments', () => {
  let Token;
  let ID1;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment before'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        ID1 = res.body.userId;
        done();
      });
  });
  it('user gets all comments', (done) => {
    Comment.create({
      userId: ID1,
      titleSlug: 'this-is-a-post',
      body: 'comment after',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    chai.request(app)
      .get('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('comments');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: {}
    });
    await Comment.destroy({
      where: { titleSlug: 'this-is-a-post' }
    });
  });
});
describe('test the get one comment', () => {
  let Token;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  it('user gets one comment', (done) => {
    chai.request(app)
      .get(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('comment');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
describe('test the delete one comment', () => {
  let Token;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  it('user deletes one comment', (done) => {
    chai.request(app)
      .delete(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql(`comment with id ${commentId} have been deleted`);
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
describe('test user delete comment they created', () => {
  let Token;
  let Token2;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user2 = {
      username: 'bee',
      email: 'bee@andela.com',
      password: 'PASSword@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user2)
      .end((err, res) => {
        Token2 = res.body.token;
      });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  it('user deletes only comment they created', (done) => {
    chai.request(app)
      .delete(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token2)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('user alters comments they only created');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: {}
    });
  });
});
describe('test the update one comment', () => {
  let Token;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  it('user updates one comment with an empty body', (done) => {
    chai.request(app)
      .put(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('response');
        res.body.response.should.have.property('id').eql(commentId);
        res.body.response.should.have.property('userId');
        res.body.response.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.response.should.have.property('body').eql('comment to fetch');
        res.body.response.should.have.property('createdAt');
        res.body.response.should.have.property('updatedAt');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
describe('test the update one comment', () => {
  let Token;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  const newComment = {
    body: 'comment to update'
  };
  it('user updates one comment with a new comment', (done) => {
    chai.request(app)
      .put(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token)
      .send(newComment)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('response');
        res.body.response.should.have.property('id').eql(commentId);
        res.body.response.should.have.property('userId');
        res.body.response.should.have.property('titleSlug').eql('this-is-a-post');
        res.body.response.should.have.property('body').eql('comment to update');
        res.body.response.should.have.property('createdAt');
        res.body.response.should.have.property('updatedAt');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: { username: 'bubble' }
    });
  });
});
describe('test if updating user created the comment', () => {
  let Token;
  let Token2;
  let commentId;
  before((done) => {
    Article.create({
      title: 'this is a post',
      body: 'this post is going to be used in testing',
      description: 'a despripton',
      image: 'http://image.com',
      slug: 'this-is-a-post',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    Comment.destroy({ force: true, where: {} });
    const user2 = {
      username: 'bee',
      email: 'bee@andela.com',
      password: 'PASSword@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user2)
      .end((err, res) => {
        Token2 = res.body.token;
      });
    const user1 = {
      username: 'bubble',
      email: 'bubble@andela.com',
      password: 'Password@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(user1)
      .end((err, res) => {
        Token = res.body.token;
        done();
      });
  });
  beforeEach((done) => {
    const data = {
      body: 'comment to fetch'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-a-post/comments')
      .set('authorization', Token)
      .send(data)
      .end((err, res) => {
        commentId = res.body.comment.id;
        done();
      });
  });
  const newComment = {
    body: 'comment to update'
  };
  it('user should update a comment they created', (done) => {
    chai.request(app)
      .put(`/api/v1/article/this-is-a-post/comments/${commentId}`)
      .set('authorization', Token2)
      .send(newComment)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('user alters comments they only created');
        done();
      });
  });
  after(async () => {
    await Article.destroy({
      where: { slug: 'this-is-a-post' }
    });
    await User.destroy({
      where: {}
    });
  });
});
describe('Test likes of a comment', () => {
  let userToken;
  let comment;
  let commentFeedbackId;
  before((done) => {
    Article.create({
      title: 'this is new',
      body: 'this post is going to be used in testing',
      description: 'a new title',
      image: 'http://image.com',
      slug: 'this-is-new',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const newUser = {
      username: 'username',
      email: 'username@andela.com',
      password: 'Andela@123!'
    };
    chai.request(app)
      .post('/api/v1/users/signup')
      .send(newUser)
      .end((err, res) => {
        userToken = res.body.token;
        done();
      });
  });
  it('should have a comment', (done) => {
    const data = {
      body: 'a new comment'
    };
    chai.request(app)
      .post('/api/v1/article/this-is-new/comments')
      .set('authorization', userToken)
      .send(data)
      .end((err, res) => {
        comment = res.body.comment.id;
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      });
  });
  it('should get comment edit histories', (done) => {
    chai.request(app)
      .get(`/api/v1/article/this-is-new/comments/${comment}/histories`)
      .set('authorization', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.commentsHistories.should.be.a('array');
        done();
      });
  });
  it('User should be able to like a comment', (done) => {
    chai.request(app)
      .post(`/api/v1/comments/${comment}/feedback/like`)
      .set('authorization', userToken)
      .end((err, res) => {
        commentFeedbackId = res.body.feedback.id;
        res.body.should.be.a('object');
        res.body.should.have.property('feedback');
        res.body.feedback.should.have.property('id');
        res.body.feedback.should.have.property('userId');
        res.body.feedback.should.have.property('commentId');
        res.body.feedback.should.have.property('feedback').eql('like');
        done();
      });
  });
  it('Should not accept  wrong parameters', (done) => {
    chai.request(app)
      .post(`/api/v1/comments/${comment}/feedback/likes`)
      .set('authorization', userToken)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('Error').eql('Only option must only be \'like\'');
        done();
      });
  });
  it('Should not accept  unexesting comment', (done) => {
    chai.request(app)
      .post('/api/v1/comments/1000000/feedback/like')
      .set('authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('body');
        done();
      });
  });
  it('Should get likes per comment', (done) => {
    chai.request(app)
      .get(`/api/v1/articles/${comment}/likes`)
      .set('authorization', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('likes');
        res.body.should.have.property('count');
        done();
      });
  });
  it('Should not delete an unexistig comment', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${comment}`)
      .set('authorization', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('errors');
        res.body.errors.should.have.property('body');
        done();
      });
  });
  it('Should delete a comment', (done) => {
    chai.request(app)
      .delete(`/api/v1/comments/${commentFeedbackId}`)
      .set('authorization', userToken)
      .end((err, res) => {
        res.body.should.be.a('object');
        res.body.should.have.property('message');
        res.body.message.should.have.property('body');
        done();
      });
  });
});
