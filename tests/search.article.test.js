import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';

chai.should();
chai.use(chaiHttp);

let Token = null;
let articleSlug = null;

describe('test search article by author', () => {
  before((done) => {
    const user = {
      username: 'bumbble',
      email: 'bumbble@andela.com',
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
  beforeEach((done) => {
    const article = {
      title: 'How articles can be used in testing',
      description: 'trying to test',
      body: 'search for this article by diffrent filtering',
      image: 'https/piimg.com'
    };
    chai.request(app)
      .post('/api/v1/articles')
      .set('authorization', Token)
      .send(article)
      .end((err, res) => {
        articleSlug = res.body.article.slug;
        done();
      });
  });
  it('search article by author', (done) => {
    const tag = { name: 'test' };
    chai.request(app)
      .post(`/api/v1/articles/${articleSlug}/tag`)
      .set('authorization', Token)
      .send(tag)
      .end(() => {});
    chai.request(app)
      .get('/api/v1/articles?author=bumbble')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        done();
      });
  });
});
describe('test search functionality with different filters', () => {
  it('search article by author for existing author', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bule')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles by bule found');
        done();
      });
  });
  it('search article by title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles can be used in testing')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        done();
      });
  });
  it('search article by title for existing title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How can in testing')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with title How can in testing found');
        done();
      });
  });
  it('search article by tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?tag=test')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by tag for existing tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?tag=travis')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with tag travis found');
        done();
      });
  });
  it('search article by keyword', (done) => {
    chai.request(app)
      .get('/api/v1/articles?keyword=artic')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        done();
      });
  });
  it('search article by keyword for keyword existing in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?keyword=notfound')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with a title containing notfound found');
        done();
      });
  });
  it('search article by author and title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&title=How articles can be used in testing')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        done();
      });
  });
  it('search article by author and title for both existing author and title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumle&title=How articles can be used in testing')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumle and title How articles can be used in testing found');
        done();
      });
  });
  it('search article by author and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&tag=test')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by author and tag for both existing author and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&tag=travis')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumbble and tag travis found');
        done();
      });
  });
  it('search article by author and keyword', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&keyword=use')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        done();
      });
  });
  it('search article by author and keyword for both existing author and keyword', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumble&keyword=usxe')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumble and keyword usxe found');
        done();
      });
  });
  it('search article by title or keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles can be used in testing&keyword=artic')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        done();
      });
  });
  it('search article by title or keyword in title for existing title or keyword', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles&keyword=usxe')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with title How articles or keyword usxe in its title found');
        done();
      });
  });
  it('search article by title and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles can be used in testing&tag=test')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by title and tag for both existing title and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles&tag=test')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with title How articles and tag test found');
        done();
      });
  });
  it('search article by tag and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?tag=test&keyword=ow')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by tag and keyword in title for both existing tag and keyword', (done) => {
    chai.request(app)
      .get('/api/v1/articles?tag=tst&keyword=owch')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with tag tst and keyword owch found');
        done();
      });
  });
  it('search article by author, title and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&title=How articles can be used in testing&tag=test')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by existing author, title and tag', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumble&title=How&tag=tet')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumble, title How and tag tet found');
        done();
      });
  });
  it('search article by author, title and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&title=How articles can be used in testing&keyword=cles')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        done();
      });
  });
  it('search article by existing author, title and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&title=How artie used in testing&keyword=clexs')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumbble and title How artie used in testing or keyword clexs found');
        done();
      });
  });
  it('search article by title, tag and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How articles can be used in testing&tag=test&keyword=cles')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by existing title, tag and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?title=How artie used in testing&tag=tes&keyword=clexs')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with title How artie used in testing, tag tes and keyword clexs found');
        done();
      });
  });
  it('search article by author, tag and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&tag=test&keyword=cles')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by existing author, tag and keyword in title', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumble&tag=est&keyword=cles')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumble, tag est and keyword cles found');
        done();
      });
  });
  it('search article by all parameters', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbble&title=How articles can be used in testing&tag=test&keyword=sting')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body[0].should.be.a('object');
        res.body[0].should.have.property('title').eql('How articles can be used in testing');
        res.body[0].should.have.property('description').eql('trying to test');
        res.body[0].should.have.property('body').eql('search for this article by diffrent filtering');
        res.body[0].should.have.property('author');
        res.body[0].author.should.have.property('username').eql('bumbble');
        res.body[0].should.have.property('tagList');
        res.body[0].tagList.should.be.a('array');
        res.body[0].tagList[0].should.be.a('object');
        res.body[0].tagList[0].should.have.property('name').eql('test');
        done();
      });
  });
  it('search article by all parameters if they exist', (done) => {
    chai.request(app)
      .get('/api/v1/articles?author=bumbe&title=Ho articles&tag=trav&keyword=stinger')
      .set('authorization', Token)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('no articles with author bumbe, title Ho articles, tag trav and keyword stinger found');
        done();
      });
  });
});
