import { MongoPostUpdateOneEvent } from './mongo-post-update-one-event';

describe('MongoPostUpdateOneEvent', () => {
  it('should be defined', () => {
    expect(new MongoPostUpdateOneEvent()).toBeDefined();
  });
});
