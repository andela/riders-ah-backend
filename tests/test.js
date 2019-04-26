import { assert } from 'chai';

const app = () => 'Andela';

describe('app', () => {
  it('app should return Andela', () => {
    assert.equal(app(), 'Andela');
  });
});
