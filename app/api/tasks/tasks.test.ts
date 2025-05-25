import * as handlers from './route';

describe('Tasks API', () => {
  it('should have a GET handler', () => {
    expect(handlers.GET).toBeDefined();
  });
  it('should have a POST handler', () => {
    expect(handlers.POST).toBeDefined();
  });
}); 