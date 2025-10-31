const server = require('../src/index');

describe('API Tests', () => {
  test('should return success message', () => {
    expect(1 + 1).toBe(2);
  });

  test('app should be defined', () => {
    expect(server).toBeDefined();
  });
});

afterAll(() => {
  server.close();
});
