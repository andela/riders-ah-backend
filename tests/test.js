import { assert } from 'chai';

const app = () => {
    return ('Andela');
}

describe('app', function () {
  it('app should return Andela', () => {
    assert.equal(app(), 'Andela');
  });
});
