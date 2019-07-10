import chai from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import TestStrategy from '../helpers/TestStrategy';

chai.use(chaiHttp);

const { expect } = chai;

describe('Stategy name should be set', () => {
  it('should fail when strategy name is not set', (done) => {
    expect(() => passport.use(new TestStrategy(undefined, () => {}))).to.throw('No strategy Name');
    done();
  });
});
