const sum = require('./sum');

test('adds 2 + 3', () => {
    expect(sum(2,3)).toBe(5);
});

test('adds 1 + 1', () => {
    expect(sum(1,1)).toBe(2);
});

test('adds 10 + 5', () => {
    expect(sum(10,5)).toBe(15);
});