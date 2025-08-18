const { expect } = require('chai');
const { sum } = require('../src/utils/sum');

describe('sum', () => {
  it('deve somar dois números', () => {
    expect(sum(2,3)).to.equal(5);
  });
});
