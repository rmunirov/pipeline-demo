const sum = require('./sum');

test('adds 2 + 3', () => {
    expect(sum(2,3)).toBe(5);
});